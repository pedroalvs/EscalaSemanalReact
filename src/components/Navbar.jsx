import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Erro ao fazer logout:', error.message);
                alert('Não foi possível fazer logout: ' + error.message);
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error('Erro inesperado ao fazer logout:', error.message);
            alert('Ocorreu um erro inesperado ao fazer logout.');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Escala Semanal</Link>
            </div>
            <div className="navbar-links">
                <Link to="/">Dashboard</Link>
                <Link to="/profile">Perfil</Link>
                <Link to="/settings">Agendamento Fixo</Link>
                <Link to="/logs">Logs</Link>
            </div>
            <div className="navbar-actions">
                <button onClick={handleLogout}>Sair</button>
            </div>
        </nav>
    );
};

export default Navbar;