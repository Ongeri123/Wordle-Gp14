import React, { useState, useEffect } from 'react';

const GameSettings = ({ onSettingsChange, initialSettings }) => {
  const [difficulty, setDifficulty] = useState(initialSettings?.difficulty || 'normal');
  const [darkMode, setDarkMode] = useState(initialSettings?.darkMode || false);
  
  // Initialize dark mode on component mount
  useEffect(() => {
    if (initialSettings?.darkMode) {
      document.body.classList.add('dark-mode-body');
    }
  }, []);

  const handleDifficultyChange = (e) => {
    const newDifficulty = e.target.value;
    setDifficulty(newDifficulty);
    onSettingsChange({ difficulty: newDifficulty, darkMode });
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    onSettingsChange({ difficulty, darkMode: newDarkMode });
    
    // Apply dark mode class to body for full-page effect
    if (newDarkMode) {
      document.body.classList.add('dark-mode-body');
    } else {
      document.body.classList.remove('dark-mode-body');
    }
  };

  return (
    <div className="game-settings">
      <h3>Game Settings</h3>
      
      <div className="setting-group">
        <label htmlFor="difficulty">Difficulty:</label>
        <select 
          id="difficulty" 
          value={difficulty} 
          onChange={handleDifficultyChange}
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="setting-group">
        <label htmlFor="darkMode">Dark Mode:</label>
        <input
          type="checkbox"
          id="darkMode"
          checked={darkMode}
          onChange={handleDarkModeToggle}
        />
      </div>
    </div>
  );
};

export default GameSettings;