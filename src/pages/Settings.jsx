
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

const Settings = ({ session }) => {
    const [persistentSchedules, setPersistentSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPersistentSchedules = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('persistent_schedules')
                    .select('day_of_week')
                    .eq('user_id', session.user.id);

                if (error) throw error;
                setPersistentSchedules(data.map(item => item.day_of_week));
            } catch (error) {
                console.error('Error fetching persistent schedules:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPersistentSchedules();
    }, [session.user.id]);

    const handleCheckboxChange = async (dayOfWeek, isChecked) => {
        if (isChecked) {
            // Adicionar dia fixo
            const { error } = await supabase
                .from('persistent_schedules')
                .insert({ user_id: session.user.id, day_of_week: dayOfWeek });
            if (error) {
                console.error('Error saving persistent schedule:', error.message);
            } else {
                setPersistentSchedules([...persistentSchedules, dayOfWeek]);
            }
        } else {
            // Remover dia fixo
            const { error } = await supabase
                .from('persistent_schedules')
                .delete()
                .match({ user_id: session.user.id, day_of_week: dayOfWeek });
            if (error) {
                console.error('Error deleting persistent schedule:', error.message);
            } else {
                setPersistentSchedules(persistentSchedules.filter(d => d !== dayOfWeek));
            }
        }
    };

    if (loading) {
        return <div>Carregando configurações...</div>;
    }

    return (
        <div>
            <h2>Configurar Dias Fixos</h2>
            <p>Marque os dias que você deseja que sejam agendados automaticamente toda semana.</p>
            <div className="persistent-schedule-form">
                {weekDays.map((day, index) => {
                    const dayOfWeek = index + 1;
                    return (
                        <div key={day}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={persistentSchedules.includes(dayOfWeek)}
                                    onChange={(e) => handleCheckboxChange(dayOfWeek, e.target.checked)}
                                />
                                {day}
                            </label>
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: '20px', fontStyle: 'italic' }}>
                <strong>Nota:</strong> A lógica para popular a escala semanal a partir dos seus dias fixos precisa ser implementada via uma Supabase Edge Function que rode periodicamente (ex: todo domingo).
            </div>
        </div>
    );
};

export default Settings;
