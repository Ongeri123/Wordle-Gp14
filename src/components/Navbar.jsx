import React, { useState } from 'react';
import GameSettings from './GameSettings';

const Navbar = ({ onSettingsChange, gameSettings }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">Wordle</div>
      <div className="navbar-right">
        <button 
          className="settings-toggle" 
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
    </nav>
  );
};

export default Navbar;