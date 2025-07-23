
import React, { useState } from 'react';
import GuessGrid from './components/GuessGrid';
import AlertMessage from './components/AlertMessage';
import Keyboard from './components/Keyboard';


const emptyRow = () => Array(5).fill({ letter: '', status: '' });

const App = () => {
  const [guesses, setGuesses] = useState([
    [
      { letter: 'W', status: 'correct' },
      { letter: 'O', status: 'wrong' },
      { letter: 'R', status: 'misplaced' },
      { letter: 'D', status: 'wrong' },
      { letter: 'S', status: 'wrong' },
    ],
    [
      { letter: 'G', status: 'correct' },
      { letter: 'A', status: 'correct' },
      { letter: 'M', status: 'correct' },
      { letter: 'E', status: 'correct' },
      { letter: 'S', status: 'correct' },
    ],
    ...Array(4).fill(emptyRow())
  ]);

  const isWin = guesses.some(row => row.every(l => l.status === 'correct'));
  const isLose = guesses.length >= 6 && !isWin;
  const [showAlert, setShowAlert] = useState(true);

  return (

    <div className="app-container">
      <h1 className="game-title">Wordle</h1>
      <GuessGrid guesses={guesses} />
      {showAlert && (
        <AlertMessage message={isWin ? "🎉 You Win!" : isLose ? "😢 Try Again!" : ""} visible={isWin || isLose} />
      )}
      <Keyboard />
    </div>
  );
};


export default App;