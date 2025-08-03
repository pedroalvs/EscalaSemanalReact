
import '../styles/ProgressBar.css';

const ProgressBar = ({ value, max }) => {
    const percentage = (value / max) * 100;
    let colorClass = 'green';
    if (value === 3) {
        colorClass = 'yellow';
    } else if (value >= 4) {
        colorClass = 'red';
    }

    return (
        <div className="progress-bar-container">
            <div
                className={`progress-bar ${colorClass}`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
