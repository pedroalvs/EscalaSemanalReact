import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/Logs.css';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('schedule_logs')
                    .select('created_at, user_display_name, action')
                    .order('created_at', { ascending: false })
                    .limit(100); // Limita a 100 logs para não sobrecarregar

                if (error) throw error;
                setLogs(data);
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) return <div>Carregando logs...</div>;

    return (
        <div className="logs-container">
            <h2>Logs de Auditoria</h2>
            <ul className="logs-list">
                {logs.map((log, index) => (
                    <li key={index} className="log-item">
                        <span className="log-timestamp">{new Date(log.created_at).toLocaleString('pt-BR')}</span>
                        <span className="log-action">{log.action}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Logs;