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
    <div className="touch-controls-container">
      {/* 1. 좌측 상단: 대형 HOLD 버튼 */}
      <div className="touch-col-left">
        <button
          className="touch-btn action-big-btn hold-big-btn"
          onPointerDown={(e) => handlePointerDown(e, onHold)}
          disabled={disabled}
        >
          <Shield size={22} />
          <span>HOLD</span>
        </button>
      </div>

      {/* 2. 중앙 십자형 D-Pad 컨트롤러 (상: 🔄, 좌: ◀, 우: ▶, 하: ▼) */}
      <div className="touch-col-center">
        {/* 십자 상단: 회전 (🔄) */}
        <div className="dpad-row-top">
          <button
            className="touch-btn dpad-square-btn rotate-blue-btn"
            onPointerDown={(e) => handlePointerDown(e, onRotate)}
            disabled={disabled}
            title="회전"
          >
            <RotateCw size={26} color="#ffffff" />
          </button>
        </div>

        {/* 십자 중앙: ◀ 좌측 이동 & ▶ 우측 이동 */}
        <div className="dpad-row-mid">
          <button
            className="touch-btn dpad-arrow-btn left-arrow-btn"
            onPointerDown={(e) => handlePointerDown(e, onMoveLeft)}
            disabled={disabled}
            title="좌측 이동"
          >
            <ArrowLeft size={30} />
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

        {/* 십자 하단: 소프트드롭 (▼) */}
        <div className="dpad-row-bot">
          <button
            className="touch-btn dpad-square-btn softdrop-blue-btn"
            onPointerDown={(e) => handlePointerDown(e, onSoftDrop)}
            disabled={disabled}
            title="아래로 이동"
          >
            <ArrowDown size={26} color="#ffffff" />
          </button>
        </div>
      </div>

      {/* 3. 우측 하단: 대형 DROP (하드드롭) 버튼 */}
      <div className="touch-col-right">
        <button
          className="touch-btn action-big-btn drop-big-btn"
          onPointerDown={(e) => handlePointerDown(e, onHardDrop)}
          disabled={disabled}
        >
          <Zap size={22} color="#ffffff" />
          <span>DROP</span>
        </button>
      </div>
    </div>
  );
};
