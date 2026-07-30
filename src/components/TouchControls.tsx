import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCw,
  Zap,
  Bookmark,
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
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Haptics fallback
      }
    }
  };

  const handleAction = (action: () => void) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    triggerHaptic();
    action();
  };

  return (
    <div className="touch-controls-container">
      {/* Action Buttons Top Bar (Hold, Rotate, Hard Drop) */}
      <div className="touch-actions-row">
        <button
          className="touch-btn action-btn hold-btn"
          onTouchStart={handleAction(onHold)}
          onClick={handleAction(onHold)}
          aria-label="Hold"
        >
          <Bookmark size={20} />
          <span>HOLD</span>
        </button>

        <button
          className="touch-btn action-btn hard-drop-btn"
          onTouchStart={handleAction(onHardDrop)}
          onClick={handleAction(onHardDrop)}
          aria-label="Hard Drop"
        >
          <Zap size={22} />
          <span>DROP</span>
        </button>

        <button
          className="touch-btn action-btn rotate-btn"
          onTouchStart={handleAction(onRotate)}
          onClick={handleAction(onRotate)}
          aria-label="Rotate"
        >
          <RotateCw size={22} />
          <span>ROTATE</span>
        </button>
      </div>

      {/* D-Pad Buttons Bottom Row (Left, Down, Right) */}
      <div className="touch-dpad-row">
        <button
          className="touch-btn dpad-btn"
          onTouchStart={handleAction(onMoveLeft)}
          onClick={handleAction(onMoveLeft)}
          aria-label="Move Left"
        >
          <ArrowLeft size={28} />
        </button>

        <button
          className="touch-btn dpad-btn"
          onTouchStart={handleAction(onSoftDrop)}
          onClick={handleAction(onSoftDrop)}
          aria-label="Soft Drop"
        >
          <ArrowDown size={28} />
        </button>

        <button
          className="touch-btn dpad-btn"
          onTouchStart={handleAction(onMoveRight)}
          onClick={handleAction(onMoveRight)}
          aria-label="Move Right"
        >
          <ArrowRight size={28} />
        </button>
      </div>
    </div>
  );
};
