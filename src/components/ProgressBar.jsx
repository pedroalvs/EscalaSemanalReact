import '../styles/ProgressBar.css';

const ProgressBar = ({ value, max }) => {
    const percentage = (value / max) * 100;
    let barColorClass = 'green';

    if (value === 3) {
        barColorClass = 'yellow';
    } else if (value >= 4) {
        barColorClass = 'red';
    }

    return (
        <div className="progress-bar-container">
            <div 
                className={`progress-bar-filler ${barColorClass}`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;