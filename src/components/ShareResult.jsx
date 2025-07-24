import React from 'react';

const ShareResult = ({ gameStats, targetWord, guesses, isWin, currentRow }) => {
  const generateShareText = () => {
    const gameNumber = gameStats.gamesPlayed;
    const attempts = isWin ? currentRow + 1 : 'X';
    
    let shareText = `Wordle ${gameNumber} ${attempts}/6\n\n`;
    
    // Generate emoji grid
    const completedRows = isWin ? currentRow + 1 : 6;
    for (let i = 0; i < completedRows; i++) {
      const row = guesses[i];
      let rowText = '';
      
      row.forEach(cell => {
        if (cell.status === 'correct') {
          rowText += '🟩';
        } else if (cell.status === 'misplaced') {
          rowText += '🟨';
        } else if (cell.status === 'wrong') {
          rowText += '⬛';
        } else {
          rowText += '⬜';
        }
      });
      
      shareText += rowText + '\n';
    }
    
    return shareText;
  };

  const handleShare = async () => {
    const shareText = generateShareText();
    
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Results copied to clipboard!');
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <button className="share-button" onClick={handleShare}>
      SHARE
    </button>
  );
};

export default ShareResult;