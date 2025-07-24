
import React, { useState, useEffect } from 'react';
import GuessGrid from './components/GuessGrid';
import AlertMessage from './components/AlertMessage';
import Keyboard from './components/Keyboard';
import Navbar from './components/Navbar';
import wordData from './db.json';


// Create a fresh empty row each time to avoid shared references
const createEmptyRow = () => [
  { letter: '', status: '' },
  { letter: '', status: '' },
  { letter: '', status: '' },
  { letter: '', status: '' },
  { letter: '', status: '' }
];

const App = () => {
  // Select a random target word from the JSON file
  const [targetWord, setTargetWord] = useState(() => {
    const words = wordData.words;
    return words[Math.floor(Math.random() * words.length)];
  });
  
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
  const [keyboardStatus, setKeyboardStatus] = useState({});
  const [gameSettings, setGameSettings] = useState({ difficulty: 'normal', darkMode: false });
  const [gameStats, setGameStats] = useState(() => {
    // Try to load stats from localStorage
    const savedStats = localStorage.getItem('wordleStats');
    return savedStats ? JSON.parse(savedStats) : {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: [0, 0, 0, 0, 0, 0]
    };
  });

  const isWin = guesses.some(row => row.every(l => l.status === 'correct'));
  const isLose = currentRow >= 6 && !isWin;
  const [showAlert, setShowAlert] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Check the current guess against the target word
  const checkGuess = (guess) => {
    const result = [...guess];
    const targetLetters = targetWord.split('');
    const newKeyboardStatus = {...keyboardStatus};
    
    // First pass: check for correct letters
    for (let i = 0; i < 5; i++) {
      if (guess[i].letter === targetLetters[i]) {
        result[i].status = 'correct';
        targetLetters[i] = null; // Mark as used
        newKeyboardStatus[guess[i].letter] = 'correct';
      }
    }
    
    // Second pass: check for misplaced letters
    for (let i = 0; i < 5; i++) {
      if (result[i].status === '') { // Skip already marked correct
        const letterIndex = targetLetters.indexOf(guess[i].letter);
        if (letterIndex !== -1) {
          result[i].status = 'misplaced';
          targetLetters[letterIndex] = null; // Mark as used
          // Only update keyboard status if not already 'correct'
          if (newKeyboardStatus[guess[i].letter] !== 'correct') {
            newKeyboardStatus[guess[i].letter] = 'misplaced';
          }
        } else {
          result[i].status = 'wrong';
          // Only update keyboard status if not already set
          if (!newKeyboardStatus[guess[i].letter]) {
            newKeyboardStatus[guess[i].letter] = 'wrong';
          }
        }
      }
    }
    
    setKeyboardStatus(newKeyboardStatus);
    return result;
  };

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
      // Handle enter - check if the row is complete
      if (currentCol === 5) {
        const currentGuess = guesses[currentRow];
        const guessWord = currentGuess.map(g => g.letter).join('');
        
        // Check if all cells have letters
        if (currentGuess.every(cell => cell.letter)) {
          const newGuesses = guesses.map(row => [...row]);
          newGuesses[currentRow] = checkGuess(currentGuess);
          setGuesses(newGuesses);
          
          // Check if the guess is correct
          const isCorrect = guessWord === targetWord;
          
          if (isCorrect) {
            setGameOver(true);
            // Update stats for win
            updateGameStats(true, currentRow);
            setGameCompleted(true);
          } else if (currentRow < 5) {
            setCurrentRow(currentRow + 1);
            setCurrentCol(0);
          } else {
            setGameOver(true);
            // Update stats for loss
            updateGameStats(false);
            setGameCompleted(true);
          }
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

  // Function to update game statistics
  const updateGameStats = (isWin, guessRow) => {
    const newStats = { ...gameStats };
    
    // Update games played
    newStats.gamesPlayed += 1;
    
    if (isWin) {
      // Update wins and streak
      newStats.gamesWon += 1;
      newStats.currentStreak += 1;
      
      // Update max streak if needed
      if (newStats.currentStreak > newStats.maxStreak) {
        newStats.maxStreak = newStats.currentStreak;
      }
      
      // Update guess distribution
      newStats.guessDistribution[guessRow] += 1;
    } else {
      // Reset streak on loss
      newStats.currentStreak = 0;
    }
    
    // Save to state and localStorage
    setGameStats(newStats);
    localStorage.setItem('wordleStats', JSON.stringify(newStats));
  };

  const handleSettingsChange = (newSettings) => {
    setGameSettings(newSettings);
    // Apply settings changes as needed
    // For example, you could adjust game difficulty here
  };

  return (
    <div className={`app-wrapper ${gameSettings.darkMode ? 'dark-mode' : ''}`}>
      <Navbar 
        onSettingsChange={handleSettingsChange} 
        gameSettings={gameSettings} 
        gameStats={gameStats}
        targetWord={targetWord}
        guesses={guesses}
        isWin={isWin}
        currentRow={currentRow}
      />
      <div className="app-container">
        {/* For development purposes - remove in production */}
        <div style={{ fontSize: '12px', marginBottom: '10px', color: '#fff' }}>Target: {targetWord}</div>
        <GuessGrid guesses={guesses} />
        {showAlert && (
          <AlertMessage 
            message={isWin ? "🎉 You Win!" : isLose ? "😢 Try Again! The word was " + targetWord : ""} 
            visible={isWin || isLose} 
          />
        )}
        <Keyboard onKeyPress={handleKeyPress} letterStatus={keyboardStatus} />
      </div>
    </div>
  );
};


export default App;