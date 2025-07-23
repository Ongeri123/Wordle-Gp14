
import React, { useState, useEffect } from 'react';
import GuessGrid from './components/GuessGrid';
import AlertMessage from './components/AlertMessage';
import Keyboard from './components/Keyboard';


// Create a fresh empty row each time to avoid shared references
const createEmptyRow = () => [
  { letter: '', status: '' },
  { letter: '', status: '' },
  { letter: '', status: '' },
  { letter: '', status: '' },
  { letter: '', status: '' }
];

const App = () => {
  const [guesses, setGuesses] = useState([
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow()
  ]);
  
  const [currentRow, setCurrentRow] = useState(0); // Start at row 1 (index 0)
  const [currentCol, setCurrentCol] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const isWin = guesses.some(row => row.every(l => l.status === 'correct'));
  const isLose = currentRow >= 6 && !isWin;
  const [showAlert, setShowAlert] = useState(true);

  const handleKeyPress = (key) => {
    if (gameOver) return;
    
    if (key === '⌫' || key === 'Backspace') {
      // Handle backspace
      if (currentCol > 0) {
        const newGuesses = guesses.map(row => [...row]);
        newGuesses[currentRow][currentCol - 1] = { letter: '', status: '' };
        setGuesses(newGuesses);
        setCurrentCol(currentCol - 1);
      }
    } else if (key === 'Enter') {
      // Handle enter - for now just move to next row if current row is complete
      if (currentCol === 5) {
        if (currentRow < 5) {
          setCurrentRow(currentRow + 1);
          setCurrentCol(0);
        } else {
          setGameOver(true);
        }
      }
    } else if (/^[A-Za-z]$/.test(key) && currentCol < 5) {
      // Handle letter input
      const newGuesses = guesses.map(row => [...row]);
      newGuesses[currentRow][currentCol] = { letter: key.toUpperCase(), status: '' };
      setGuesses(newGuesses);
      setCurrentCol(currentCol + 1);
    }
  };

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentRow, currentCol, gameOver]); // Removed guesses from dependency array to avoid unnecessary re-renders

  return (
    <div className="app-container">
      <h1 className="game-title">Wordle</h1>
      <GuessGrid guesses={guesses} />
      {showAlert && (
        <AlertMessage message={isWin ? " You Win!" : isLose ? "Try Again!" : ""} visible={isWin || isLose} />
      )}
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
};


export default App;