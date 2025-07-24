
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

/**
 * Main App component - handles game state and logic
 */
const App = () => {
  // Get daily word based on current date (with optional day offset)
  const getDailyWord = (dayOffset = 0) => {
    const today = new Date();
    today.setDate(today.getDate() + dayOffset);
    const startDate = new Date('2024-01-01'); // Reference date
    const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const words = wordData.words;
    return words[daysSinceStart % words.length];
  };

  const [dayOffset, setDayOffset] = useState(0);

  // Game state variables
  const [targetWord, setTargetWord] = useState(() => getDailyWord(dayOffset));
  
  const [guesses, setGuesses] = useState([
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow()
  ]);
  
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState({});
  const [gameSettings, setGameSettings] = useState({ difficulty: 'normal', darkMode: false });
  const [gameStats, setGameStats] = useState(() => {
    const savedStats = localStorage.getItem('wordleStats');
    return savedStats ? JSON.parse(savedStats) : {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: [0, 0, 0, 0, 0, 0]
    };
  });

  // Check if it's a new day and reset game state
  useEffect(() => {
    const today = new Date().toDateString();
    const lastPlayDate = localStorage.getItem('lastPlayDate');
    
    if (lastPlayDate !== today) {
      // New day - reset game state
      setTargetWord(getDailyWord(dayOffset));
      setGuesses([
        createEmptyRow(),
        createEmptyRow(),
        createEmptyRow(),
        createEmptyRow(),
        createEmptyRow(),
        createEmptyRow()
      ]);
      setCurrentRow(0);
      setCurrentCol(0);
      setGameOver(false);
      setKeyboardStatus({});
      setGameCompleted(false);
      localStorage.setItem('lastPlayDate', today);
    }
  }, []);

  // Game status checks
  const isWin = guesses.some(row => row.every(l => l.status === 'correct'));
  const isLose = currentRow >= 6 && !isWin;
  const [showAlert, setShowAlert] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showGameOptions, setShowGameOptions] = useState(false);

  /**
   * Evaluates a guess against the target word
   * Returns array with letter statuses (correct, misplaced, wrong)
   */
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

  /**
   * Handles keyboard input for the game
   * Processes letters, backspace, and enter key
   */
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
            setShowGameOptions(true);
          } else if (currentRow < 5) {
            setCurrentRow(currentRow + 1);
            setCurrentCol(0);
          } else {
            setGameOver(true);
            // Update stats for loss
            updateGameStats(false);
            setGameCompleted(true);
            setShowGameOptions(true);
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

  /**
   * Sets up event listener for physical keyboard input
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentRow, currentCol, gameOver]); // Removed guesses from dependency array to avoid unnecessary re-renders

  /**
   * Function to update game statistics
   */
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
    localStorage.setItem('lastPlayDate', new Date().toDateString());
  };

  /**
   * Updates game settings (difficulty, dark mode)
   */
  const handleSettingsChange = (newSettings) => {
    setGameSettings(newSettings);
  };

  /**
   * Skip to next day's word
   */
  const handleSkipDay = () => {
    const newOffset = dayOffset + 1;
    setDayOffset(newOffset);
    setTargetWord(getDailyWord(newOffset));
    setGuesses([
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow()
    ]);
    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);
    setKeyboardStatus({});
    setGameCompleted(false);
  };

  /**
   * Starts a new game with the daily word
   */
  const handleNext = () => {
    setTargetWord(getDailyWord(dayOffset));
    setGuesses([
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow()
    ]);
    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);
    setKeyboardStatus({});
  };

  /**
   * Resets the current game with the same word
   */
  const handleRetry = () => {
    setGuesses([
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow()
    ]);
    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);
    setKeyboardStatus({});
    setShowGameOptions(false);
  };

  /**
   * Wait for next word (close options modal)
   */
  const handleWaitNext = () => {
    setShowGameOptions(false);
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
        onNext={handleNext}
        onRetry={handleRetry}
        onSkipDay={handleSkipDay}
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
        {showGameOptions && (
          <div className="game-options-modal">
            <div className="game-options-content">
              <h3>{isWin ? "Congratulations!" : "Game Over"}</h3>
              <p>{isWin ? "You solved today's puzzle!" : `The word was: ${targetWord}`}</p>
              <div className="game-options-buttons">
                <button onClick={handleRetry} className="option-btn retry-btn">
                  Play Again
                </button>
                <button onClick={handleWaitNext} className="option-btn wait-btn">
                  Wait for Next Word
                </button>
              </div>
            </div>
          </div>
        )}
        <Keyboard onKeyPress={handleKeyPress} letterStatus={keyboardStatus} />
      </div>
    </div>
  );
};


export default App;