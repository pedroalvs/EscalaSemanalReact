
import { supabase } from '../supabaseClient';

const Auth = () => {
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
        });
        if (error) {
            console.error('Error logging in:', error.message);
        }
    };

    return (
        <div className="auth-container">
            <h1>Gerenciador de Escala Semanal</h1>
            <p>Faça login para continuar</p>
            <button onClick={handleLogin} className="button-primary">
                Login com Azure AD
            </button>
        </div>
    );
};

export default Auth;
