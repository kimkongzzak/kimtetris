import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCw,
  Zap,
  Shield,
  RefreshCw,
} from 'lucide-react';

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onTSpin: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  disabled?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onTSpin,
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
      {/* Left Cluster: Top HOLD, Middle T-SPIN, Bottom HARD DROP */}
      <div className="touch-group-left">
        <button
          className="touch-btn action-btn hold-btn"
          onPointerDown={(e) => handlePointerDown(e, onHold)}
          disabled={disabled}
        >
          <Shield size={13} />
          <span>HOLD</span>
        </button>

        <button
          className="touch-btn action-btn tspin-btn"
          onPointerDown={(e) => handlePointerDown(e, onTSpin)}
          disabled={disabled}
        >
          <RefreshCw size={13} className="text-purple-400" />
          <span>T-SPIN</span>
        </button>

        <button
          className="touch-btn action-btn hard-drop-btn vibrant-hard-drop"
          onPointerDown={(e) => handlePointerDown(e, onHardDrop)}
          disabled={disabled}
        >
          <Zap size={14} color="#ffffff" />
          <span>HARD DROP</span>
        </button>
      </div>

      {/* Right Cluster: Keypad format */}
      <div className="touch-group-right">
        {/* Top Row: Rotate Button 🔁 */}
        <div className="touch-row-top">
          <button
            className="touch-btn rotate-top-btn"
            onPointerDown={(e) => handlePointerDown(e, onRotate)}
            disabled={disabled}
          >
            <RotateCw size={15} />
            <span>회전 🔁</span>
          </button>
        </div>

        {/* Bottom Row: ◀️ Down ▶️ */}
        <div className="touch-row-bottom">
          <button
            className="touch-btn dpad-btn"
            onPointerDown={(e) => handlePointerDown(e, onMoveLeft)}
            disabled={disabled}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            className="touch-btn dpad-btn"
            onPointerDown={(e) => handlePointerDown(e, onSoftDrop)}
            disabled={disabled}
          >
            <ArrowDown size={18} />
          </button>
          <button
            className="touch-btn dpad-btn"
            onPointerDown={(e) => handlePointerDown(e, onMoveRight)}
            disabled={disabled}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
