// CSS
import './EndScreen.css';

const EndScreen = ({tryAgain, score}) => {
    return (
        <div className="start">
            <h1>Game Over</h1>
            <h2>A sua pontuação foi: <span>{score}</span></h2>
            <p>Press the button to restart</p>
            <button onClick={tryAgain}>Try Again</button>
        </div>
    );
};

export default EndScreen;