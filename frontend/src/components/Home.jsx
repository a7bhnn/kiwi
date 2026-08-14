//import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // If the user is already logged in, send them straight to their dashboard
    if (user) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#111111', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', display: 'flex', flexDirection: 'column' }}>
            <header style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.025em', margin: 0 }}>Kiwi</h1>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    
                    {/* 2. Explicit Sign In Button */}
                    <button 
                        onClick={() => navigate('/login')}
                        style={{ background: 'none', border: 'none', color: '#d1d5db', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                    >
                        Sign In
                    </button>

                    {/* 3. Explicit Get Started Button */}
                    <button 
                        onClick={() => navigate('/register')}
                        style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '9999px', border: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
                    >
                        Get Started
                    </button>
                </div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 24px', textAlign: 'center', marginTop: '-80px' }}>
                <div style={{ padding: '8px 16px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#60a5fa', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', marginBottom: '24px', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                    Your Personal Media Tracker
                </div>
                
                <h2 style={{ fontSize: '56px', fontWeight: '800', letterSpacing: '-0.025em', margin: '0 0 24px 0', lineHeight: 1.1, maxWidth: '800px' }}>
                    Track every movie and show you've ever watched.
                </h2>
                
                <p style={{ fontSize: '18px', color: '#9ca3af', maxWidth: '600px', margin: '0 0 40px 0', lineHeight: 1.6 }}>
                    Say goodbye to forgotten recommendations. Search millions of titles, organize your watchlist, and rate your favorites all in one seamless dashboard.
                </p>
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    
                    {/* 4. Explicit Main Action Button */}
                    <button 
                        onClick={() => navigate('/register')}
                        style={{ backgroundColor: '#2563eb', color: 'white', padding: '16px 32px', borderRadius: '16px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' }}
                    >
                        Create your Watchlist
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;