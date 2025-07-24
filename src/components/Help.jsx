import React from 'react';

/**
 * Help component with game instructions and color guide
 */
const Help = () => {
  return (
    <div className="help-content">
      <h3>How to Play Wordle</h3>
      
      <div className="help-section">
        <h4>Objective</h4>
        <p>Guess the 5-letter word in 6 attempts or less.</p>
      </div>

      <div className="help-section">
        <h4>How to Play</h4>
        <ul>
          <li>Type letters using your keyboard or click the on-screen keyboard</li>
          <li>Press Enter to submit your guess</li>
          <li>Use Backspace to delete letters</li>
        </ul>
      </div>

      <div className="help-section">
        <h4>Color Guide</h4>
        <div className="color-examples">
          <div className="color-example">
            <div className="letter-box correct">A</div>
            <span>Correct letter in correct position</span>
          </div>
          <div className="color-example">
            <div className="letter-box misplaced">B</div>
            <span>Correct letter in wrong position</span>
          </div>
          <div className="color-example">
            <div className="letter-box wrong">C</div>
            <span>Letter not in the word</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;