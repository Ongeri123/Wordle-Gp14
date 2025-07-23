import React from 'react';

const Keyboard = () => {
  const rows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Enter','Z','X','C','V','B','N','M','⌫']
  ];

  return (
    <div className="keyboard">
      {rows.map((row, idx) => (
        <div key={idx} className="keyboard-row">
          {row.map(key => (
            <button key={key} className={`key-btn ${key === 'Enter' || key === '⌫' ? 'wide' : ''}`}>{key}</button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;

