import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('register/', { username, password });
            await login(username, password);
            navigate('/');
        } catch {
            setError('Registration failed. Username might already be taken.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#111111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
            <div style={{ maxWidth: '400px', width: '100%', backgroundColor: '#18181b', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '-0.025em' }}>Create Account</h2>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>Start tracking your personal movie watchlist.</p>
                
                {error && <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '14px' }}>{error}</div>}
                
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#d1d5db', marginBottom: '6px' }}>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            style={{ width: '100%', backgroundColor: '#27272a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '12px 16px', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                            required 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#d1d5db', marginBottom: '6px' }}>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={{ width: '100%', backgroundColor: '#27272a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '12px 16px', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                            required 
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', fontWeight: '600', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '8px', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' }}>
                        Sign Up & Log In
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af', marginTop: '24px' }}>
                    Already have an account? <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;