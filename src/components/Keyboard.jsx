import React from 'react';

/**
 * Virtual keyboard component with letter status indicators
 */
const Keyboard = ({ onKeyPress, letterStatus = {} }) => {
  const rows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Enter','Z','X','C','V','B','N','M','⌫']
  ];

  /**
   * Handles virtual keyboard button clicks
   */
  const handleClick = (key) => {
    if (onKeyPress) {
      onKeyPress(key);
    }
  };

  /**
   * Returns CSS class based on key status
   */
  const getKeyClass = (key) => {
    if (key === 'Enter' || key === '⌫') {
      return `key-btn wide`;
    }
    
    const status = letterStatus[key];
    if (status) {
      return `key-btn ${status}`;
    }
    
    return 'key-btn';
  };

  return (
    <div className="keyboard">
      {rows.map((row, idx) => (
        <div key={idx} className="keyboard-row">
          {row.map(key => (
            <button 
              key={key} 
              className={getKeyClass(key)}
              onClick={() => handleClick(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;

