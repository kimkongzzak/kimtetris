import React from 'react';
import { GameStats } from '../types/tetris';
import { Trophy, Zap, Layers, Hash } from 'lucide-react';

interface ScoreBoardProps {
  stats: GameStats;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ stats }) => {
  return (
    <div className="glass-panel scoreboard-panel">
      <h3 className="panel-title">STATS</h3>

      <div className="stat-group highlight">
        <div className="stat-label">
          <Trophy size={16} className="text-yellow-400" />
          <span>BEST SCORE</span>
        </div>
        <div className="stat-value text-yellow-400">
          {stats.highScore.toLocaleString()}
        </div>
      </div>

      <div className="stat-group">
        <div className="stat-label">
          <Zap size={16} className="text-cyan-400" />
          <span>SCORE</span>
        </div>
        <div className="stat-value text-cyan-400">
          {stats.score.toLocaleString()}
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-group compact">
          <div className="stat-label">
            <Hash size={14} className="text-purple-400" />
            <span>LEVEL</span>
          </div>
          <div className="stat-value">{stats.level}</div>
        </div>

        <div className="stat-group compact">
          <div className="stat-label">
            <Layers size={14} className="text-emerald-400" />
            <span>LINES</span>
          </div>
          <div className="stat-value">{stats.lines}</div>
        </div>
      </div>

      {stats.combo > 0 && (
        <div className="combo-badge">
          🔥 {stats.combo} COMBO!
        </div>
      )}
    </div>
  );
};
