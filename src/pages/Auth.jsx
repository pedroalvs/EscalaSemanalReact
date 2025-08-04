import { useState } from 'react';
import { supabase } from '../supabaseClient';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            alert('Login bem-sucedido!');
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            alert('Verifique seu e-mail para confirmar o cadastro!');
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Gerenciador de Escala Semanal</h1>
            <p>Faça login ou cadastre-se para continuar.</p>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Senha</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Carregando...' : 'Login'}
                    </button>
                    <button type="button" className="auth-button secondary" onClick={handleSignUp} disabled={loading}>
                        {loading ? 'Carregando...' : 'Cadastrar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Auth;