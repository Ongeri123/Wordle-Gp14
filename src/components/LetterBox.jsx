import React from 'react';

/**
 * Individual letter box with color-coded status
 */
const LetterBox = ({ letter, status }) => {
  const statusClasses = {
    correct: 'letter-box correct',
    misplaced: 'letter-box misplaced',
    wrong: 'letter-box wrong',
    default: 'letter-box'
  };

  return (
    <div className={statusClasses[status || 'default']}>
      {letter}
    </div>
  );
};

export default LetterBox;
