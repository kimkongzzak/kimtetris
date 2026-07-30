import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCw,
  Zap,
  Shield,
} from 'lucide-react';

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  disabled?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onHold,
  disabled = false,
}) => {
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(12);
    }
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    action: () => void
  ) => {
    e.preventDefault();
    if (disabled) return;
    triggerHaptic();
    action();
  };

  return (
    <div className="touch-controls-container stepped-layout">
      {/* 1단 (상단 좌측): 대형 HOLD 버튼 */}
      <div className="touch-stealth-row row-top">
        <button
          className="touch-btn action-big-btn hold-stepped-btn"
          onPointerDown={(e) => handlePointerDown(e, onHold)}
          disabled={disabled}
        >
          <Shield size={20} />
          <span>HOLD</span>
        </button>
      </div>

      {/* 2단 (중앙 미묘한 단차 네비게이션): ◀, ▼ (중앙 하단 단차), ▶ */}
      <div className="touch-stealth-row row-mid">
        <button
          className="touch-btn dpad-arrow-btn left-arrow-btn"
          onPointerDown={(e) => handlePointerDown(e, onMoveLeft)}
          disabled={disabled}
          title="좌측 이동"
        >
          <ArrowLeft size={30} />
        </button>

        <button
          className="touch-btn dpad-square-btn softdrop-blue-btn center-offset-down"
          onPointerDown={(e) => handlePointerDown(e, onSoftDrop)}
          disabled={disabled}
          title="아래로 이동 (소프트드롭)"
        >
          <ArrowDown size={26} color="#ffffff" />
        </button>

        <button
          className="touch-btn dpad-arrow-btn right-arrow-btn"
          onPointerDown={(e) => handlePointerDown(e, onMoveRight)}
          disabled={disabled}
          title="우측 이동"
        >
          <ArrowRight size={30} />
        </button>
      </div>

      {/* 3단 (하단 우측 세트): 🔄 (회전) + DROP (하드드롭) */}
      <div className="touch-stealth-row row-bot">
        <div className="drop-rotate-group">
          <button
            className="touch-btn dpad-square-btn rotate-blue-btn"
            onPointerDown={(e) => handlePointerDown(e, onRotate)}
            disabled={disabled}
            title="회전"
          >
            <RotateCw size={26} color="#ffffff" />
          </button>

          <button
            className="touch-btn action-big-btn drop-stepped-btn"
            onPointerDown={(e) => handlePointerDown(e, onHardDrop)}
            disabled={disabled}
          >
            <Zap size={20} color="#ffffff" />
            <span>DROP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
