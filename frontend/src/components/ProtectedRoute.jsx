import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    // Wait to check until the lazy initialization is complete
    if (loading) {
        return <div>Loading your watchlist...</div>;
    }

    // If no user is found in the context, redirect to the login page
    if (!user) {
        return user ? children : <Navigate to="/" />;
    }

    // If they are logged in, let them see the private dashboard
    return children;
};

export default ProtectedRoute;