import React, { useState } from 'react';
import GameSettings from './GameSettings';
import Help from './Help';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faQuestion, faForward, faRedo } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

// Add icons to the library
library.add(faCog, faQuestion, faForward, faRedo);

/**
 * Navigation bar component with game controls
 * Contains Next, Retry, Help, and Settings buttons
 */
const Navbar = ({ onSettingsChange, gameSettings, onNext, onRetry }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">Wordle</div>
      <div className="navbar-right">
        <button 
          className="next-toggle" 
          onClick={onNext}
        >
          <FontAwesomeIcon icon={faForward} /> Next
        </button>
        
        <button 
          className="retry-toggle" 
          onClick={onRetry}
        >
          <FontAwesomeIcon icon={faRedo} /> Retry
        </button>
        
        <button 
          className="help-toggle" 
          onClick={() => setShowHelp(!showHelp)}
        >
          <FontAwesomeIcon icon={faQuestion} />
        </button>
        {showHelp && (
          <div className="help-dropdown">
            <Help />
          </div>
        )}
        
        <button 
          className="settings-toggle" 
          onClick={() => setShowSettings(!showSettings)}
        >
          <FontAwesomeIcon icon={faCog} />
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