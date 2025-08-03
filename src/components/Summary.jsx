
import ProgressBar from './ProgressBar';
import '../styles/Summary.css';

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const MAX_CAPACITY = 4;

const Summary = ({ schedules }) => {
    const getOccupancy = (dayOfWeek) => {
        return schedules.filter(s => s.day_of_week === dayOfWeek).length;
    };

    return (
        <div className="summary-container">
            {weekDays.map((day, index) => {
                const dayOfWeek = index + 1;
                const occupancy = getOccupancy(dayOfWeek);
                return (
                    <div key={day} className="summary-card">
                        <h3>{day}</h3>
                        <p>{occupancy} / {MAX_CAPACITY}</p>
                        <ProgressBar value={occupancy} max={MAX_CAPACITY} />
                    </div>
                );
            })}
        </div>
    );
};

export default Summary;
