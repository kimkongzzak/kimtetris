import React from 'react';
import { LeaderboardEntry } from '../types/tetris';
import { Crown, Trophy, X, Medal } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  topScores: LeaderboardEntry[];
  currentHighScore: number;
  currentHighScoreNickname: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  topScores = [],
  currentHighScore,
  currentHighScoreNickname,
}) => {
  if (!isOpen) return null;

  // Determine #1 Champion (either from topScores[0] or fallback to current global record)
  const top1 = topScores.length > 0 ? topScores[0] : {
    nickname: currentHighScoreNickname || 'CYBER_LEGEND',
    score: currentHighScore,
    date: new Date().toISOString().split('T')[0],
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content leaderboard-modal">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Trophy size={22} className="text-yellow-400" />
            <h2>GLOBAL LEADERBOARD (명예의 전당)</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Flashy Ultra #1 Champion Card */}
          <div className="top-champion-card">
            <div className="champion-badge">
              <Crown size={24} className="crown-icon" />
              <span>전설의 1위 (TOP CHAMPION)</span>
            </div>
            <div className="top-champion-name">{top1.nickname}</div>
            <div className="top-champion-score">{top1.score.toLocaleString()} PTS</div>
          </div>

          {/* Ranks List */}
          <div className="leaderboard-full-list">
            <h4 className="list-title">🏆 Top 랭커 순위</h4>
            <div className="list-container">
              {topScores.length === 0 ? (
                <div className="empty-msg">기록된 점수가 없습니다. 첫 번째 전설이 되어보세요!</div>
              ) : (
                topScores.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`rank-row ${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : ''}`}
                  >
                    <span className="rank-num">
                      {idx === 0 && <Crown size={16} color="#ffd700" />}
                      {idx === 1 && <Medal size={16} color="#c0c0c0" />}
                      {idx === 2 && <Medal size={16} color="#cd7f32" />}
                      {idx > 2 && `#${idx + 1}`}
                    </span>
                    <span className="player-name">{entry.nickname}</span>
                    <span className="player-date">{entry.date}</span>
                    <span className="player-score">{entry.score.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ marginTop: '1rem' }}>
          <button className="neon-button primary-btn" onClick={onClose}>
            닫기 (CLOSE)
          </button>
        </div>
      </div>
    </div>
  );
};
