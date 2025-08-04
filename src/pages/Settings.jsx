import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Settings = ({ session }) => {
    const [persistentSchedule, setPersistentSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

    useEffect(() => {
        const fetchPersistentSchedule = async () => {
            try {
                setLoading(true);
                const { user } = session || {};
                if (!user) return; // Exit if user is not available

                const { data, error } = await supabase
                    .from('persistent_schedules')
                    .select('day_of_week')
                    .eq('user_id', user.id);

                if (error) throw error;
                setPersistentSchedule(data.map(item => item.day_of_week));
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPersistentSchedule();
    }, [session?.user?.id]);

    const handleCheckboxChange = async (dayIndex, isChecked) => {
        const day = dayIndex + 1;
        let newSchedule = [...persistentSchedule];

        try {
            if (isChecked) {
                // Adicionar dia fixo
                newSchedule.push(day);
                const { error } = await supabase.from('persistent_schedules').insert({ 
                    user_id: session.user.id, 
                    day_of_week: day 
                });
                if (error) throw error;
            } else {
                // Remover dia fixo
                newSchedule = newSchedule.filter(d => d !== day);
                const { error } = await supabase.from('persistent_schedules').delete().match({ 
                    user_id: session.user.id, 
                    day_of_week: day 
                });
                if (error) throw error;
            }
            setPersistentSchedule(newSchedule);
        } catch (error) {
            alert('Erro ao salvar agendamento fixo: ' + error.message);
            // Reverte a mudança visual em caso de erro
            setPersistentSchedule(persistentSchedule);
        }
    };

    return (
        <div className="settings-container">
            <h2>Configurações de Agendamento Fixo</h2>
            <p>Marque os dias que você deseja que sejam agendados automaticamente toda semana.</p>
            <div className="persistent-schedule-form">
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="checkbox-item">
                        <input 
                            type="checkbox"
                            id={`day-${index}`}
                            checked={persistentSchedule.includes(index + 1)}
                            onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                        />
                        <label htmlFor={`day-${index}`}>{day}</label>
                    </div>
                ))}
            </div>
            <div className="info-box">
                <strong>Nota:</strong> A lógica para aplicar estes dias fixos a cada nova semana precisa ser executada por uma função automatizada (Supabase Edge Function) no início de cada semana.
            </div>
        </div>
    );
};

export default Settings;