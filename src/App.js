// CSS
import './App.css';

// React
import {useCallback, useState, useEffect} from "react";

// Data
import {wordsList} from "./data/word";

// Components
import StartScreen from "./components/StartScreen/StartScreen";
import GameScreen from "./components/GameScreen/GameScreen";
import EndScreen from "./components/EndScreen/EndScreen";

const stages = [
    {id: 1, name: "start"},
    {id: 2, name: "game"},
    {id: 3, name: "end"},
];

const guessesQty = 5

function App() {
    const [gameStage, setGameStage] = useState(stages[0].name);
    const [words] = useState(wordsList);


    // Select words, categories and letters
    const [pickedWord, setPickedWord] = useState("");
    const [pickedCategory, setPickedCategory] = useState("");
    const [letters, setLetters] = useState([]);

    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [guesses, setGuesses] = useState(guessesQty);
    const [score, setScore] = useState(0);

    const pickWordAndCategory = useCallback(() => {

        // pick random category
        const categories = Object.keys(words);
        const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

        // pick random word
        const word = words[category][Math.floor(Math.random() * words[category].length)];

        return {word, category};
    }, [words]);

    // Game stages
    const startGame = useCallback(() => {
        clearLetterStages();

        // Pick word and pick category
        const { word, category } = pickWordAndCategory();

        // create an array of letter

        let wordLetters = word.split("");

        wordLetters = wordLetters.map((l) => l.toLowerCase());

        // fill states
        setPickedWord(word);
        setPickedCategory(category);
        setLetters(wordLetters);

        setGameStage(stages[1].name);
    }, [pickWordAndCategory]);

    const verifyLetter = (letter) => {
        const normalizedLetter = letter.toLowerCase();

        if(
            guessedLetters.includes(normalizedLetter) ||
            wrongLetters.includes(normalizedLetter)
        ) {
            return;
        }

        if(letters.includes(normalizedLetter)) {
            setGuessedLetters((actualGuessedLetters) => [
                ...actualGuessedLetters,
                normalizedLetter
            ])
        } else {
            setWrongLetters((actualWrongLetters) => [
                ...actualWrongLetters,
                normalizedLetter
            ]);

            setGuesses((actualGuesses) => actualGuesses - 1);
        }
    };

    const clearLetterStages = () => {
        setGuessedLetters([])
        setWrongLetters([])
    };

    useEffect(() => {
        if (guesses <= 0){
            setGameStage(stages[2].name);

            clearLetterStages();
        }
    }, [guesses]);

    useEffect(() => {
        const uniqueLetters = [...new Set(letters)];

        if (guessedLetters.length === uniqueLetters.length) {
            setScore((actualScore) => actualScore += 100 );
            startGame();
        }

    }, [guessedLetters, letters, startGame]);

    const tryAgain = () => {
        setScore(0);
        setGuesses(guessesQty);

        setGameStage(stages[0].name);
    };

    return (
        <div className="App">
            {gameStage === 'start' && <StartScreen startGame={startGame} />}
            {gameStage === 'game' && (
                <GameScreen
                verifyLetter={verifyLetter}
                pickedWord={pickedWord}
                pickedCategory={pickedCategory}
                letters={letters}
                guessedLetters={guessedLetters}
                wrongLetters={wrongLetters}
                guesses={guesses}
                score={score}
            />
            )}
            {gameStage === 'end' && <EndScreen tryAgain={tryAgain} score={score} />}
        </div>
    );
}

export default App;
