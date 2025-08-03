
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
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setLogs(data);
            } catch (error) {
                console.error('Error fetching logs:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) {
        return <div>Carregando logs...</div>;
    }

    return (
        <div className="logs-container">
            <h2>Logs de Auditoria</h2>
            <ul className="logs-list">
                {logs.map(log => (
                    <li key={log.id}>
                        <span className="log-time">{new Date(log.created_at).toLocaleString()}</span>
                        <span className="log-action">{log.action}</span>
                        <span className="log-user">por {log.user_display_name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Logs;
