import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainRoutes from './routes/main.routes';

function App() {
    return (
        <Router>
            <AuthProvider>
                {/* Tüm sayfa yönlendirmeleri burada yönetilir */}
                <MainRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;