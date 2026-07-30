import React, { useState } from 'react';
import { GameStats } from '../types/tetris';
import { Trophy, RefreshCw, Layers, Zap, Send, CheckCircle2, User } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  onRestart: () => void;
  onSubmitHighScore: (nickname: string, score: number) => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onRestart,
  onSubmitHighScore,
}) => {
  const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;
  const [nickname, setNickname] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || isSubmitted) return;
    onSubmitHighScore(nickname.trim(), stats.score);
    setIsSubmitted(true);
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content game-over-modal">
        <div className="game-over-header">
          <h1 className="glitch-text">GAME OVER</h1>
          {isNewHighScore ? (
            <div className="new-record-badge">
              <Trophy size={18} /> ✨ 최고 기록 갱신! 1위 등극 ✨
            </div>
          ) : (
            <div className="record-badge-sub">
              기록을 명예의 전당에 남기세요!
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
              <span className="label"><Trophy size={16} /> TOP RECORD ({stats.highScoreNickname})</span>
              <span className="value highlight">{stats.highScore.toLocaleString()}</span>
            </div>

            <div className="final-stat-row">
              <div className="final-stat compact">
                <span className="label">FINAL LEVEL</span>
                <span className="value">{stats.level}</span>
              </div>

              <div className="final-stat compact">
                <span className="label"><Layers size={14} /> LINES</span>
                <span className="value">{stats.lines}</span>
              </div>
            </div>
          </div>

          {/* Nickname Submission Form with Premium Input UI */}
          {stats.score > 0 && (
            <div className="nickname-form-card">
              <h4 className="nickname-title">
                <Trophy size={15} className="text-yellow-400" />
                <span>명예의 전당 점수 등록</span>
              </h4>
              {isSubmitted ? (
                <div className="submitted-msg">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span>명예의 전당 DB에 성공적으로 등록되었습니다!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="nickname-input-group">
                  <div className="input-wrapper">
                    <User size={16} className="input-icon" />
                    <input
                      type="text"
                      placeholder="닉네임 입력 (최대 12자)"
                      maxLength={12}
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="nickname-input"
                      autoFocus
                    />
                    <span className="char-counter">{nickname.length}/12</span>
                  </div>
                  <button type="submit" className="submit-nick-btn" disabled={!nickname.trim()}>
                    <Send size={15} />
                    <span>등록</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Top Scores Leaderboard Preview Card */}
          {stats.topScores && stats.topScores.length > 0 && (
            <div className="leaderboard-preview-card">
              <h4 className="leaderboard-preview-title">
                <Trophy size={15} className="text-yellow-400" />
                <span>명예의 전당 (Top 5)</span>
              </h4>
              <div className="leaderboard-preview-list">
                {stats.topScores.slice(0, 5).map((entry, idx) => (
                  <div key={idx} className={`leaderboard-preview-item rank-${idx + 1}`}>
                    <span className="item-rank-badge">
                      {idx === 0 ? '🥇 1위' : idx === 1 ? '🥈 2위' : idx === 2 ? '🥉 3위' : `#${idx + 1}`}
                    </span>
                    <span className="item-name">{entry.nickname || '익명'}</span>
                    <span className="item-score">{entry.score.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="neon-button primary-btn restart-btn" onClick={onRestart}>
            <RefreshCw size={18} /> 다시 시작하기 (RETRY)
          </button>
        </div>
      </div>
    </div>
  );
};
