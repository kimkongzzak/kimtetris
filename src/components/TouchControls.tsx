import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCw,
  Zap,
  Shield,
} from 'lucide-react';
import { TetrominoType } from '../types/tetris';
import { TETROMINOES } from '../utils/tetris';

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  holdPieceType?: TetrominoType | null;
  blockOpacity?: number;
  disabled?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onHold,
  holdPieceType,
  blockOpacity = 0.85,
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

  const renderMiniHoldPiece = (type?: TetrominoType | null) => {
    if (!type) {
      return (
        <div className="touch-mini-grid">
          {Array.from({ length: 16 }).map((_, idx) => (
            <div key={idx} className="touch-mini-cell empty" />
          ))}
        </div>
      );
    }

    const config = TETROMINOES[type];
    const rawShape = config.shapes[0];
    const matrix4x4: number[][] = Array.from({ length: 4 }, () => [0, 0, 0, 0]);

    const rawRows = rawShape.length;
    const rawCols = rawShape[0].length;
    const startRow = Math.floor((4 - rawRows) / 2);
    const startCol = Math.floor((4 - rawCols) / 2);

    for (let r = 0; r < rawRows; r++) {
      for (let c = 0; c < rawCols; c++) {
        if (rawShape[r][c] !== 0) {
          matrix4x4[startRow + r][startCol + c] = 1;
        }
      }
    }

    return (
      <div className="touch-mini-grid">
        {matrix4x4.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`touch-mini-cell ${cell ? 'filled' : 'empty'}`}
              style={
                cell
                  ? {
                      backgroundColor: config.color,
                      boxShadow: `0 0 4px ${config.glowColor}`,
                      opacity: blockOpacity,
                    }
                  : {}
              }
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="touch-controls-container stepped-layout">
      {/* 1단 (중앙 네비게이션): ◀, ▼ (소프트드롭), ▶ */}
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

      {/* 2단 (하단): HOLD 세트 (미니 미리보기 + HOLD 버튼) & 🔄 + DROP 세트 */}
      <div className="touch-stealth-row row-bot">
        <div className="hold-touch-group">
          <div className="mini-hold-preview-badge" title="현재 HOLD 블록 미리보기">
            {renderMiniHoldPiece(holdPieceType)}
          </div>
          <button
            className="touch-btn action-big-btn hold-stepped-btn"
            onPointerDown={(e) => handlePointerDown(e, onHold)}
            disabled={disabled}
          >
            <Shield size={18} />
            <span>HOLD</span>
          </button>
        </div>

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
