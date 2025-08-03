
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/Navbar.css';

const Navbar = () => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Escala Semanal</Link>
            </div>
            <div className="navbar-links">
                <Link to="/">Dashboard</Link>
                <Link to="/settings">Dias Fixos</Link>
                <Link to="/logs">Logs</Link>
                <Link to="/profile">Perfil</Link>
                <button onClick={handleLogout}>Sair</button>
            </div>
        </nav>
    );
};

export default Navbar;
