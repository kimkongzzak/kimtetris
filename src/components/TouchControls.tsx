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
      navigator.vibrate(10);
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
    <div className="touch-controls-container">
      {/* 1단 (상단): HOLD (좌) & DROP (우) */}
      <div className="touch-row-top">
        <button
          className="touch-btn action-btn hold-btn"
          onPointerDown={(e) => handlePointerDown(e, onHold)}
          disabled={disabled}
        >
          <Shield size={16} />
          <span>HOLD</span>
        </button>

        <button
          className="touch-btn action-btn drop-btn vibrant-hard-drop"
          onPointerDown={(e) => handlePointerDown(e, onHardDrop)}
          disabled={disabled}
        >
          <Zap size={16} color="#ffffff" />
          <span>DROP</span>
        </button>
      </div>

      {/* 2단 (중앙): 시계방향 회전 (↻) */}
      <div className="touch-row-mid">
        <button
          className="touch-btn rotate-circle-btn vibrant-rotate"
          onPointerDown={(e) => handlePointerDown(e, onRotate)}
          disabled={disabled}
          title="회전"
        >
          <RotateCw size={26} color="#ffffff" />
        </button>
      </div>

      {/* 3단 (하단): ◀ (좌), ▼ (아래/소프트드롭), ▶ (우) */}
      <div className="touch-row-bot">
        <button
          className="touch-btn dpad-btn"
          onPointerDown={(e) => handlePointerDown(e, onMoveLeft)}
          disabled={disabled}
          title="왼쪽 이동"
        >
          <ArrowLeft size={22} />
        </button>

        <button
          className="touch-btn dpad-btn"
          onPointerDown={(e) => handlePointerDown(e, onSoftDrop)}
          disabled={disabled}
          title="아래로 소프트드롭"
        >
          <ArrowDown size={22} />
        </button>

        <button
          className="touch-btn dpad-btn"
          onPointerDown={(e) => handlePointerDown(e, onMoveRight)}
          disabled={disabled}
          title="오른쪽 이동"
        >
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
};
