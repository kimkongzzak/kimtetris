import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/tetris';
import { Crown, Trophy, X, Medal, RotateCcw, ChevronDown } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  topScores: LeaderboardEntry[];
  currentHighScore: number;
  currentHighScoreNickname: string;
  onRefresh?: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  topScores = [],
  currentHighScore,
  currentHighScoreNickname,
  onRefresh,
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(5);

  useEffect(() => {
    if (isOpen) {
      setVisibleCount(5);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine #1 Champion (either from topScores[0] or fallback to current global record)
  const top1 = topScores.length > 0 ? topScores[0] : {
    nickname: currentHighScoreNickname || '김박사',
    score: currentHighScore,
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };

  const displayedScores = topScores.slice(0, visibleCount);
  const hasMore = topScores.length > visibleCount;

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content leaderboard-modal">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Trophy size={22} className="text-yellow-400" />
            <h2>GLOBAL LEADERBOARD (명예의 전당)</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onRefresh && (
              <button
                className="icon-btn"
                onClick={onRefresh}
                title="실시간 랭킹 새로고침"
                style={{ padding: '0.25rem 0.45rem', fontSize: '0.7rem' }}
              >
                <RotateCcw size={14} />
                <span>새로고침</span>
              </button>
            )}
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
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
            <div className="list-title-row">
              <h4 className="list-title">🏆 Top 랭커 순위 (실시간 DB 연동)</h4>
              {topScores.length > 0 && (
                <span className="rank-count-badge">
                  {displayedScores.length} / {topScores.length}개 표시
                </span>
              )}
            </div>

            <div className="list-container">
              {topScores.length === 0 ? (
                <div className="empty-msg">기록된 점수가 없습니다. 첫 번째 전설이 되어보세요!</div>
              ) : (
                displayedScores.map((entry, idx) => (
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

            {/* Load More Button for 5+ rows */}
            {hasMore && (
              <button
                className="load-more-btn"
                onClick={() => setVisibleCount((prev) => prev + 5)}
              >
                <ChevronDown size={16} />
                <span>5개 더보기 ({displayedScores.length}/{topScores.length})</span>
              </button>
            )}
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
