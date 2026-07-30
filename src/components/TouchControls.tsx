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

  // Modern pointer down handler preventing synthetic double-click events
  const handlePointerDown = (action: () => void) => (e: React.PointerEvent) => {
    e.preventDefault();
    if (disabled) return;
    triggerHaptic();
    action();
  };

  return (
    <div className="touch-controls-container">
      {/* Action Buttons Top Bar (Hold, Hard Drop, Rotate) */}
      <div className="touch-actions-row">
        <button
          className="touch-btn action-btn hold-btn"
          onPointerDown={handlePointerDown(onHold)}
          aria-label="Hold"
        >
          <Bookmark size={18} />
          <span>HOLD</span>
        </button>

        <button
          className="touch-btn action-btn hard-drop-btn"
          onPointerDown={handlePointerDown(onHardDrop)}
          aria-label="Hard Drop"
        >
          <Zap size={20} />
          <span>DROP</span>
        </button>

        <button
          className="touch-btn action-btn rotate-btn"
          onPointerDown={handlePointerDown(onRotate)}
          aria-label="Rotate"
        >
          <RotateCw size={20} />
          <span>ROTATE</span>
        </button>
      </div>

      {/* D-Pad Buttons Bottom Row (Left, Down, Right) */}
      <div className="touch-dpad-row">
        <button
          className="touch-btn dpad-btn"
          onPointerDown={handlePointerDown(onMoveLeft)}
          aria-label="Move Left"
        >
          <ArrowLeft size={24} />
        </button>

        <button
          className="touch-btn dpad-btn"
          onPointerDown={handlePointerDown(onSoftDrop)}
          aria-label="Soft Drop"
        >
          <ArrowDown size={24} />
        </button>

        <button
          className="touch-btn dpad-btn"
          onPointerDown={handlePointerDown(onMoveRight)}
          aria-label="Move Right"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};
