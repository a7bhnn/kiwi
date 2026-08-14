import { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Lazy initialization: instantly check local storage before the first render
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('access');
        if (token) {
            try {
                return jwtDecode(token);
            } catch {
                return null;
            }
        }
        return null;
    });

    // 2. No useEffect needed, so loading starts as false
    const [loading] = useState(false);

    const login = async (username, password) => {
        const response = await api.post('token/', { username, password });
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        setUser(jwtDecode(response.data.access));
    };

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};