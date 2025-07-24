import React, { useState } from 'react';
import GameSettings from './GameSettings';
import Stats from './Stats';

const Navbar = ({ onSettingsChange, gameSettings, gameStats }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">Wordle</div>
      <div className="navbar-right">
        <button 
          className="navbar-button stats-button" 
          onClick={() => setShowStats(true)}
        >
          📊 Stats
        </button>
        <button 
          className="navbar-button settings-toggle" 
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️ Settings
        </button>
        {showSettings && (
          <div className="settings-dropdown">
            <GameSettings 
              onSettingsChange={onSettingsChange} 
              initialSettings={gameSettings}
            />
          </div>
        )}
      </div>
      <Stats 
        isOpen={showStats} 
        onClose={() => setShowStats(false)} 
        gameStats={gameStats} 
      />
    </nav>
  );
};

export default Navbar;