
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Profile = ({ session }) => {
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true);
                const { user } = session;

                const { data, error, status } = await supabase
                    .from('profiles')
                    .select(`display_name`)
                    .eq('id', user.id)
                    .single();

                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    setDisplayName(data.display_name);
                }
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [session]);

    const updateProfile = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { user } = session;

            const updates = {
                id: user.id,
                display_name: displayName,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) {
                throw error;
            }
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-widget">
            <h2>Meu Perfil</h2>
            <form onSubmit={updateProfile}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="text" value={session.user.email} disabled />
                </div>
                <div>
                    <label htmlFor="displayName">Nome de Exibição</label>
                    <input
                        id="displayName"
                        type="text"
                        value={displayName || ''}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>

                <div>
                    <button className="button-primary" type="submit" disabled={loading}>
                        {loading ? 'Salvando ...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
