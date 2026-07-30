import React from 'react';
import { GameStats } from '../types/tetris';
import { Trophy, RefreshCw, Layers, Zap } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart }) => {
  const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content game-over-modal">
        <div className="game-over-header">
          <h1 className="glitch-text">GAME OVER</h1>
          {isNewHighScore && (
            <div className="new-record-badge">
              <Trophy size={18} /> NEW HIGH SCORE!
            </div>
          )}
        </div>

        <div className="modal-body">
          <div className="final-stats-card">
            <div className="final-stat">
              <span className="label"><Zap size={16} /> FINAL SCORE</span>
              <span className="value primary">{stats.score.toLocaleString()}</span>
            </div>

            <div className="final-stat">
              <span className="label"><Trophy size={16} /> BEST RECORD</span>
              <span className="value highlight">{stats.highScore.toLocaleString()}</span>
            </div>

            <div className="final-stat-row">
              <div className="final-stat compact">
                <span className="label">LEVEL</span>
                <span className="value">{stats.level}</span>
              </div>

              <div className="final-stat compact">
                <span className="label"><Layers size={14} /> LINES</span>
                <span className="value">{stats.lines}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="neon-button primary-btn restart-btn" onClick={onRestart}>
            <RefreshCw size={20} /> 다시 시작하기 (RETRY)
          </button>
        </div>
      </div>
    </div>
  );
};
