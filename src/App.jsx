import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import './styles/App.css'; // Adicionado: Importa estilos globais para App

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Busca a sessão ativa ao carregar a aplicação
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };

        getSession();

        // Escuta por mudanças no estado de autenticação (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        // Limpa a inscrição ao desmontar o componente
        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div>Carregando...</div>; // Ou um componente de spinner
    }

    return (
        <Router>
            {session && <Navbar />}
            <div className="container">
                <Routes>
                    <Route path="/login" element={!session ? <Auth /> : <Navigate to="/" />} />
                    <Route path="/" element={session ? <Dashboard session={session} /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={session ? <Profile session={session} /> : <Navigate to="/login" />} />
                    <Route path="/logs" element={session ? <Logs /> : <Navigate to="/login" />} />
                    <Route path="/settings" element={session ? <Settings session={session} /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;