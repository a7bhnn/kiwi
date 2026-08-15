import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [movies, setMovies] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [activeTab, setActiveTab] = useState('To Watch'); 
    const [typeFilter, setTypeFilter] = useState('All'); 
    const [error, setError] = useState('');
    
    // --- NEW SEARCH STATES ---
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // 1. Fetch initial watchlist on load
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get('media/');
                setMovies(response.data);
            } catch {
                setError('Failed to fetch your watchlist.');
            }
        };
        fetchMovies();
    }, []);

    // 2. Fetch TMDB suggestions dynamically as user types (Debounced)
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (newTitle.trim().length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsSearching(true);
            try {
                const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${newTitle}`);
                const tmdbData = await tmdbRes.json();
                
                // Filter out actors/people, keep only movies & tv, and grab the top 5
                const validResults = tmdbData.results
                    .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
                    .slice(0, 5);
                
                setSuggestions(validResults);
                setShowSuggestions(true);
            } catch (err) {
                console.error("TMDB Search Error:", err);
            } finally {
                setIsSearching(false);
            }
        };

        // Wait 400ms after the user stops typing before fetching to save API calls
        const delayDebounceFn = setTimeout(() => {
            fetchSuggestions();
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [newTitle]);

    // 3. Add the explicitly clicked suggestion to the database
    const handleSelectSuggestion = async (item) => {
        const isTv = item.media_type === 'tv';
        
        try {
            const response = await api.post('media/', {
                title: item.title || item.name,
                media_type: isTv ? 'TV' : 'Movie',
                status: 'Unwatched',
                tmdb_id: item.id,
                poster_path: item.poster_path,
                overview: item.overview,
                release_date: item.release_date || item.first_air_date,
                rating: null
            });
            
            setMovies([response.data, ...movies]); // Add new item to the top of the list
            setNewTitle('');
            setSuggestions([]);
            setShowSuggestions(false);
            setError('');
        } catch {
            setError('Failed to add item.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`media/${id}/`);
            setMovies(movies.filter((movie) => movie.id !== id));
        } catch {
            setError('Failed to delete item.');
        }
    };

    const handleToggleStatus = async (movie) => {
        const newStatus = movie.status === 'Watched' ? 'Unwatched' : 'Watched';
        const newRating = newStatus === 'Unwatched' ? null : movie.rating;
        try {
            const response = await api.patch(`media/${movie.id}/`, { status: newStatus, rating: newRating });
            setMovies(movies.map((m) => 
                m.id === movie.id ? { ...m, status: response.data.status, rating: response.data.rating } : m
            ));
        } catch {
            setError('Failed to update status.');
        }
    };

    const handleRateMovie = async (movie, rating) => {
        try {
            const response = await api.patch(`media/${movie.id}/`, { rating });
            setMovies(movies.map((m) => 
                m.id === movie.id ? { ...m, rating: response.data.rating } : m
            ));
        } catch {
            setError('Failed to update rating.');
        }
    };

    const filteredMovies = movies.filter((movie) => {
        const matchesStatus = activeTab === 'To Watch' ? movie.status !== 'Watched' : movie.status === 'Watched';
        const matchesType = typeFilter === 'All' ? true : movie.media_type === typeFilter;
        return matchesStatus && matchesType;
    });

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#111111', color: 'white', paddingBottom: '80px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
            <header style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', backgroundColor: 'rgba(0, 0, 0, 0.4)', position: 'sticky', top: 0, zIndex: 50, padding: '16px 32px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.025em' }}>Kiwi</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {user && (
                            <span style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '500' }}>
                                Welcome, {user.username}!
                            </span>
                        )}
                        <button 
                            onClick={logout} 
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', padding: '8px 16px', borderRadius: '9999px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '0 24px' }}>
                {error && <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '14px' }}>{error}</div>}

                {/* --- NEW SEARCH BAR WITH DROPDOWN --- */}
                <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 32px', zIndex: 40 }}>
                    <input 
                        type="text" 
                        value={newTitle} 
                        onChange={(e) => setNewTitle(e.target.value)} 
                        placeholder="Search for a movie or TV show..." 
                        style={{ width: '100%', backgroundColor: '#18181b', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '16px 20px', color: 'white', outline: 'none', fontSize: '16px', boxSizing: 'border-box' }}
                    />
                    
                    {/* Loading Indicator inside the input */}
                    {isSearching && (
                        <div style={{ position: 'absolute', right: '20px', top: '18px', color: '#9ca3af', fontSize: '14px' }}>Searching...</div>
                    )}

                    {/* Auto-Suggest Dropdown */}
                    {showSuggestions && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#18181b', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', marginTop: '8px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                            {suggestions.length === 0 && newTitle.trim().length >= 2 ? (
                                <div style={{ padding: '16px', color: '#9ca3af', textAlign: 'center' }}>No results found</div>
                            ) : (
                                suggestions.map((item) => (
                                    <div 
                                        key={item.id}
                                        onClick={() => handleSelectSuggestion(item)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'transparent' }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {/* Dropdown Poster */}
                                        {item.poster_path ? (
                                            <img src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} alt={item.title || item.name} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                                        ) : (
                                            <div style={{ width: '40px', height: '60px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>N/A</div>
                                        )}
                                        
                                        {/* Dropdown Details */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', fontSize: '15px' }}>{item.title || item.name}</div>
                                            <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                                <span style={{ textTransform: 'capitalize' }}>{item.media_type}</span>
                                                <span>•</span>
                                                <span>{(item.release_date || item.first_air_date || 'Unknown').substring(0, 4)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                    {['To Watch', 'Watched'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                border: '1px solid',
                                backgroundColor: activeTab === tab ? '#2563eb' : 'rgba(255, 255, 255, 0.03)',
                                color: activeTab === tab ? 'white' : 'rgba(255, 255, 255, 0.6)',
                                borderColor: activeTab === tab ? '#2563eb' : 'rgba(255, 255, 255, 0.08)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
                    {['All', 'Movie', 'TV'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            style={{
                                padding: '6px 16px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                border: '1px solid',
                                backgroundColor: typeFilter === type ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                color: typeFilter === type ? 'white' : 'rgba(255, 255, 255, 0.4)',
                                borderColor: typeFilter === type ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            {type === 'All' ? 'All Types' : type === 'Movie' ? 'Movies' : 'TV Shows'}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredMovies.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255, 255, 255, 0.4)' }}>
                            <p style={{ fontSize: '18px', fontWeight: '500' }}>No items found</p>
                            <p style={{ fontSize: '14px', marginTop: '4px' }}>Try changing your filters or searching a new title above.</p>
                        </div>
                    ) : (
                        filteredMovies.map((movie) => (
                            <div 
                                key={movie.id} 
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '1 1 250px' }}>
                                    {movie.poster_path ? (
                                        <img 
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                                            alt={movie.title} 
                                            style={{ width: '56px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                                        />
                                    ) : (
                                        <div style={{ width: '56px', height: '80px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'rgba(255, 255, 255, 0.3)' }}>No Image</div>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {/* The dimming color logic has been removed here, so it is always 'white' */}
                                        <h3 style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '-0.025em', margin: 0, color: 'white', wordBreak: 'break-word' }}>
                                            {movie.title} <span style={{ fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px' }}>{movie.release_date && `(${movie.release_date.substring(0,4)})`}</span>
                                        </h3>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: '600', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                                {movie.media_type || 'Movie'}
                                            </span>

                                            <span style={{ padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '500', backgroundColor: movie.status === 'Watched' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: movie.status === 'Watched' ? '#34d399' : '#fbbf24', border: movie.status === 'Watched' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)' }}>
                                                {movie.status || 'Unwatched'}
                                            </span>

                                            {movie.status === 'Watched' && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
                                                    {movie.rating && (
                                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#fbbf24', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                                            ★ {movie.rating} / 5
                                                        </span>
                                                    )}
                                                    <select 
                                                        value={movie.rating || ''} 
                                                        onChange={(e) => handleRateMovie(movie, e.target.value ? parseFloat(e.target.value) : null)}
                                                        style={{ backgroundColor: '#27272a', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                                                    >
                                                        <option value="">{movie.rating ? 'Change Rating...' : 'Rate 0.5 - 5 ★'}</option>
                                                        {[0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((r) => (
                                                            <option key={r} value={r}>{r} ★</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto', justifyContent: 'flex-start' }}>
                                    <button 
                                        onClick={() => handleToggleStatus(movie)}
                                        style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', border: '1px solid', backgroundColor: movie.status === 'Watched' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(16, 185, 129, 0.2)', color: movie.status === 'Watched' ? 'rgba(255, 255, 255, 0.7)' : '#34d399', borderColor: movie.status === 'Watched' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(16, 185, 129, 0.3)', whiteSpace: 'nowrap' }}
                                    >
                                        {movie.status === 'Watched' ? 'Mark Unwatched' : 'Watched'}
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleDelete(movie.id)}
                                        style={{ padding: '8px 12px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        title="Delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;