import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Summary from '../components/Summary';
import ScheduleTable from '../components/ScheduleTable';
import '../styles/Dashboard.css';

const Dashboard = ({ session }) => {
    const [profiles, setProfiles] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para obter a data de início da semana (segunda-feira)
    const getWeekStartDate = () => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para domingo
        return new Date(today.setDate(diff)).toISOString().slice(0, 10);
    };

    const weekStartDate = getWeekStartDate();

    // Efeito para buscar dados iniciais
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Buscar todos os perfis
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, display_name');
                if (profilesError) throw profilesError;
                setProfiles(profilesData || []);

                // 2. Buscar agendamentos da semana atual
                const { data: schedulesData, error: schedulesError } = await supabase
                    .from('weekly_schedules')
                    .select('user_id, day_of_week')
                    .eq('week_start_date', weekStartDate);
                if (schedulesError) throw schedulesError;
                setSchedules(schedulesData || []);

            } catch (err) {
                setError(err.message);
                console.error("Erro ao buscar dados:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [weekStartDate]);

    // Efeito para escutar mudanças em tempo real na tabela de agendamentos
    useEffect(() => {
        const channel = supabase
            .channel('weekly_schedules_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'weekly_schedules' },
                (payload) => {
                    console.log('Mudança recebida!', payload);
                    // Simplesmente recarrega os agendamentos ao receber uma mudança
                    const fetchSchedules = async () => {
                        const { data: schedulesData, error: schedulesError } = await supabase
                            .from('weekly_schedules')
                            .select('user_id, day_of_week')
                            .eq('week_start_date', weekStartDate);
                        if (schedulesError) console.error(schedulesError);
                        else setSchedules(schedulesData || []);
                    };
                    fetchSchedules();
                }
            )
            .subscribe();

        // Limpa a inscrição ao desmontar o componente
        return () => {
            supabase.removeChannel(channel);
        };
    }, [weekStartDate]);

    if (loading) return <div>Carregando dashboard...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div className="dashboard">
            <h2>Escala da Semana ({weekStartDate})</h2>
            <Summary schedules={schedules} />
            <ScheduleTable 
                profiles={profiles} 
                schedules={schedules} 
                currentUser={session?.user} 
                weekStartDate={weekStartDate} 
            />
        </div>
    );
};

export default Dashboard;