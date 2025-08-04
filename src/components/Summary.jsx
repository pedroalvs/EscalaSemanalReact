import ProgressBar from './ProgressBar';
import '../styles/Summary.css';

const Summary = ({ schedules }) => {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    const maxCapacity = 4;

    const getOcupationByDay = (dayIndex) => {
        return schedules.filter(s => s.day_of_week === dayIndex + 1).length;
    };

    return (
        <div className="summary-container">
            {days.map((day, index) => {
                const ocupation = getOcupationByDay(index);
                return (
                    <div key={day} className="summary-day-card">
                        <h3>{day}</h3>
                        <p className="ocupation-text">{ocupation} / {maxCapacity}</p>
                        <ProgressBar value={ocupation} max={maxCapacity} />
                    </div>
                );
            })}
        </div>
    );
};

export default Summary;