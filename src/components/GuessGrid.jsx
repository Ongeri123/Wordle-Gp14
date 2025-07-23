import React from 'react';
import LetterBox from './LetterBox';

const GuessGrid = ({ guesses }) => {
  return (
    <div className="guess-grid">
      {guesses.map((guess, rowIdx) => (
        <div key={rowIdx} className="guess-row">
          {guess.map((letterObj, letterIdx) => (
            <LetterBox key={letterIdx} letter={letterObj.letter} status={letterObj.status} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GuessGrid;