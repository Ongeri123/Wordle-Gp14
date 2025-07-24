import React from 'react';
import ShareResult from './ShareResult';

const Stats = ({ isOpen, onClose, gameStats, targetWord, guesses, isWin, currentRow }) => {
  const stats = gameStats || {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  };

  const winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  if (!isOpen) return null;

  return (
    <div className="stats-modal">
      <div className="stats-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2>Statistics</h2>
        
        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-number">{stats.gamesPlayed}</div>
            <div className="stat-label">Played</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{winPercentage}</div>
            <div className="stat-label">Win %</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.maxStreak}</div>
            <div className="stat-label">Max Streak</div>
          </div>
        </div>
        
        <h3>Guess Distribution</h3>
        <div className="guess-distribution">
          {stats.guessDistribution.map((count, index) => (
            <div className="guess-row" key={index}>
              <div className="guess-number">{index + 1}</div>
              <div className="guess-bar-container">
                <div 
                  className="guess-bar" 
                  style={{ 
                    width: `${(count / maxDistribution) * 100}%`,
                    backgroundColor: count > 0 ? '#538d4e' : '#787c7e'
                  }}
                >
                  {count > 0 && <span>{count}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="stats-footer">
          <ShareResult 
            gameStats={gameStats}
            targetWord={targetWord}
            guesses={guesses}
            isWin={isWin}
            currentRow={currentRow}
          />
        </div>
      </div>
    </div>
  );
};

export default Stats;