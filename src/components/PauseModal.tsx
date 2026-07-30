import React from 'react';
import { Play, RotateCcw, PauseCircle } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content pause-modal">
        <div className="modal-header" style={{ justifyContent: 'center' }}>
          <PauseCircle size={28} className="text-cyan-400" />
          <h2 style={{ marginLeft: '0.5rem' }}>GAME PAUSED (일시정지)</h2>
        </div>

        <div className="modal-body" style={{ textAlign: 'center', padding: '1rem 0' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            화면을 벗어났거나 게임이 일시정지되었습니다.<br />
            준비가 되면 아래 버튼을 눌러 재개하세요.
          </p>
        </div>

        <div className="modal-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button className="neon-button primary-btn" onClick={onResume}>
            <Play size={18} /> 게임 재개 (RESUME)
          </button>
          <button className="neon-button secondary-btn restart-btn" onClick={onRestart}>
            <RotateCcw size={16} /> 게임 다시 시작 (RESTART)
          </button>
        </div>
      </div>
    </div>
  );
};
