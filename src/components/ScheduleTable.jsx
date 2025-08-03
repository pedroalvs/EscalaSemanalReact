
import { supabase } from '../supabaseClient';
import '../styles/ScheduleTable.css';

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const MAX_CAPACITY = 4;

const ScheduleTable = ({ profiles, schedules, session, weekStartDate }) => {

    const handleScheduleChange = async (profileId, dayOfWeek, isChecked) => {
        if (isChecked) {
            // Adicionar agendamento
            const { error } = await supabase
                .from('weekly_schedules')
                .insert({ user_id: profileId, day_of_week: dayOfWeek, week_start_date: weekStartDate });
            if (error) console.error('Error creating schedule:', error.message);

        } else {
            // Remover agendamento
            const { error } = await supabase
                .from('weekly_schedules')
                .delete()
                .match({ user_id: profileId, day_of_week: dayOfWeek, week_start_date: weekStartDate });
            if (error) console.error('Error deleting schedule:', error.message);
        }
    };

    const getDayOccupancy = (dayOfWeek) => {
        return schedules.filter(s => s.day_of_week === dayOfWeek).length;
    };

    return (
        <table className="schedule-table">
            <thead>
                <tr>
                    <th>Profissional</th>
                    {weekDays.map(day => <th key={day}>{day}</th>)}
                </tr>
            </thead>
            <tbody>
                {profiles.map(profile => (
                    <tr key={profile.id}>
                        <td>{profile.display_name || 'Usuário sem nome'}</td>
                        {weekDays.map((day, index) => {
                            const dayOfWeek = index + 1;
                            const isScheduled = schedules.some(s => s.user_id === profile.id && s.day_of_week === dayOfWeek);
                            const isCurrentUser = profile.id === session.user.id;
                            const isDayFull = getDayOccupancy(dayOfWeek) >= MAX_CAPACITY;

                            const cellStyle = isDayFull && !isScheduled ? { backgroundColor: '#ffdddd' } : {};

                            return (
                                <td key={day} style={cellStyle}>
                                    {isCurrentUser ? (
                                        <input
                                            type="checkbox"
                                            checked={isScheduled}
                                            onChange={(e) => handleScheduleChange(profile.id, dayOfWeek, e.target.checked)}
                                            disabled={isDayFull && !isScheduled}
                                        />
                                    ) : (
                                        isScheduled ? '✔️' : ''
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ScheduleTable;
