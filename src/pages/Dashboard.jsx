
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Summary from '../components/Summary';
import ScheduleTable from '../components/ScheduleTable';
import '../styles/Dashboard.css';

// Função para obter o início da semana (segunda-feira)
const getWeekStartDate = () => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff)).toISOString().slice(0, 10);
};

const Dashboard = ({ session }) => {
    const [profiles, setProfiles] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const weekStartDate = getWeekStartDate();

    const fetchData = async () => {
        setLoading(true);
        try {
            // Busca perfis
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, display_name');
            if (profilesError) throw profilesError;
            setProfiles(profilesData);

            // Busca agendamentos da semana atual
            const { data: schedulesData, error: schedulesError } = await supabase
                .from('weekly_schedules')
                .select('*')
                .eq('week_start_date', weekStartDate);
            if (schedulesError) throw schedulesError;
            setSchedules(schedulesData);

        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Listener do Realtime para a tabela de agendamentos
        const subscription = supabase
            .channel('weekly_schedules')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'weekly_schedules' }, (payload) => {
                console.log('Change received!', payload);
                fetchData(); // Refaz o fetch dos dados para atualizar a UI
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [weekStartDate]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <h2>Escala da Semana ({weekStartDate})</h2>
            <Summary schedules={schedules} />
            <ScheduleTable profiles={profiles} schedules={schedules} session={session} weekStartDate={weekStartDate} />
        </div>
    );
};

export default Dashboard;
