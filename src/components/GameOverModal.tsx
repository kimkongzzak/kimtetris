import React, { useState } from 'react';
import { GameStats } from '../types/tetris';
import { Trophy, RefreshCw, Layers, Zap, Send, CheckCircle2 } from 'lucide-react';

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

          {/* Always Show Nickname Submission Form if score > 0 */}
          {stats.score > 0 && (
            <div className="nickname-form-card">
              <h4 className="nickname-title">🏆 점수 & 닉네임 기록 등록</h4>
              {isSubmitted ? (
                <div className="submitted-msg">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span>서버 명예의 전당에 성공적으로 등록되었습니다!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="nickname-input-group">
                  <input
                    type="text"
                    placeholder="닉네임 입력 (최대 12자)"
                    maxLength={12}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="nickname-input"
                    autoFocus
                  />
                  <button type="submit" className="submit-nick-btn" disabled={!nickname.trim()}>
                    <Send size={16} /> 등록
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Top Scores Leaderboard Preview */}
          {stats.topScores && stats.topScores.length > 0 && (
            <div className="leaderboard-preview">
              <h5>📊 명예의 전당 (Top 5)</h5>
              <div className="leaderboard-list">
                {stats.topScores.slice(0, 5).map((entry, idx) => (
                  <div key={idx} className="leaderboard-item">
                    <span className="rank">#{idx + 1}</span>
                    <span className="name">{entry.nickname}</span>
                    <span className="score">{entry.score.toLocaleString()}</span>
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
