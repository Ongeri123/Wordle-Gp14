import React from 'react';

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
