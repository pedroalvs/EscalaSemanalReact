import { supabase } from '../supabaseClient';
import '../styles/ScheduleTable.css';

const ScheduleTable = ({ profiles, schedules, currentUser, weekStartDate }) => {
    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    const maxCapacity = 4;

    const dailyOcupation = daysOfWeek.map((_, dayIndex) => 
        schedules.filter(s => s.day_of_week === dayIndex + 1).length
    );

    const handleCheckboxChange = async (profileId, dayIndex, isChecked) => {
        const day = dayIndex + 1;

        try {
            if (isChecked) {
                // Adicionar agendamento e log
                const { error: scheduleError } = await supabase
                    .from('weekly_schedules')
                    .insert({ 
                        user_id: profileId, 
                        day_of_week: day, 
                        week_start_date: weekStartDate 
                    });
                if (scheduleError) throw scheduleError;

                const { error: logError } = await supabase.from('schedule_logs').insert({
                    user_id: currentUser.id,
                    user_display_name: profiles?.find(p => p.id === currentUser.id)?.display_name || 'Usuário',
                    action: `${profiles?.find(p => p.id === currentUser.id)?.display_name || 'Usuário'} agendou para ${daysOfWeek[dayIndex]}.`
                });
                if (logError) throw logError;

            } else {
                // Remover agendamento e log
                const { error: scheduleError } = await supabase
                    .from('weekly_schedules')
                    .delete()
                    .match({ user_id: profileId, day_of_week: day, week_start_date: weekStartDate });
                if (scheduleError) throw scheduleError;

                const { error: logError } = await supabase.from('schedule_logs').insert({
                    user_id: currentUser.id,
                    user_display_name: profiles.find(p => p.id === currentUser.id)?.display_name || 'Usuário',
                    action: `${profiles.find(p => p.id === currentUser.id)?.display_name || 'Usuário'} cancelou o agendamento para ${daysOfWeek[dayIndex]}.`
                });
                if (logError) throw logError;
            }
        } catch (error) {
            console.error('Erro ao atualizar agendamento:', error.message);
            alert('Não foi possível atualizar o agendamento: ' + error.message);
        }
    };

    return (
        <div className="schedule-table-container">
            <table className="schedule-table">
                <thead>
                    <tr>
                        <th>Profissional</th>
                        {daysOfWeek.map(day => <th key={day}>{day}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {profiles.map(profile => {
                        const isCurrentUser = profile.id === currentUser.id;
                        return (
                            <tr key={profile.id}>
                                <td>{profile.display_name || 'Nome não definido'}</td>
                                {daysOfWeek.map((_, dayIndex) => {
                                    const isScheduled = schedules.some(s => s.user_id === profile.id && s.day_of_week === dayIndex + 1);
                                    const isDayFull = dailyOcupation[dayIndex] >= maxCapacity;
                                    const isDisabled = isCurrentUser && isDayFull && !isScheduled;

                                    return (
                                        <td key={dayIndex} className={isDayFull && !isScheduled ? 'full-day' : ''}>
                                            {isCurrentUser ? (
                                                <input 
                                                    type="checkbox" 
                                                    checked={isScheduled}
                                                    disabled={isDisabled}
                                                    onChange={(e) => handleCheckboxChange(profile.id, dayIndex, e.target.checked)}
                                                />
                                            ) : (
                                                isScheduled && '✔️'
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduleTable;