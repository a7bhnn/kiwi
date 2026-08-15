import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'; // <-- ADD THIS LINE!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* The AuthProvider MUST wrap the App component! */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);