import { supabase } from '../supabaseClient';

const Auth = () => {

    const handleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'azure',
            });
            if (error) throw error;
        } catch (error) {
            console.error('Erro ao fazer login com Azure AD:', error.message);
        }
    };

    return (
        <div className="auth-container">
            <h1>Gerenciador de Escala Semanal</h1>
            <p>Por favor, faça login para continuar.</p>
            <button onClick={handleLogin} className="auth-button">
                Login com Azure AD
            </button>
        </div>
    );
};

export default Auth;