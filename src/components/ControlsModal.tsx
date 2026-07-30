import React from 'react';
import { X, Keyboard, Smartphone } from 'lucide-react';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-content">
        <div className="modal-header">
          <h2>조작법 안내 (CONTROLS)</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="controls-section">
            <h3><Keyboard size={18} /> 데스크톱 키보드 조작법</h3>
            <div className="control-list">
              <div className="control-item">
                <span className="key-badge">←</span> <span className="key-badge">→</span>
                <span>좌/우 이동</span>
              </div>
              <div className="control-item">
                <span className="key-badge">↑</span> <span className="key-badge">X</span>
                <span>시계 방향 회전</span>
              </div>
              <div className="control-item">
                <span className="key-badge">Z</span> <span className="key-badge">Ctrl</span>
                <span>반시계 방향 회전</span>
              </div>
              <div className="control-item">
                <span className="key-badge">↓</span>
                <span>소프트 드롭 (천천히 내리기)</span>
              </div>
              <div className="control-item">
                <span className="key-badge">Spacebar</span>
                <span>하드 드롭 (즉시 착지)</span>
              </div>
              <div className="control-item">
                <span className="key-badge">C</span> <span className="key-badge">Shift</span>
                <span>홀드 (블록 보관/교체)</span>
              </div>
              <div className="control-item">
                <span className="key-badge">P</span> <span className="key-badge">Esc</span>
                <span>일시정지 / 재개</span>
              </div>
            </div>
          </div>

          <div className="controls-section">
            <h3><Smartphone size={18} /> 모바일 터치 조작법</h3>
            <p className="touch-desc">
              화면 하단에 표시되는 전용 D-Pad 컨트롤러와 드롭/회전/홀드 버튼을 터치하여 바로 플레이할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="neon-button primary-btn" onClick={onClose}>
            확인 및 게임으로 이동
          </button>
        </div>
      </div>
    </div>
  );
};
