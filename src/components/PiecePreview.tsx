import React from 'react';
import { TetrominoType } from '../types/tetris';
import { TETROMINOES } from '../utils/tetris';

interface PiecePreviewProps {
  title: string;
  pieceType: TetrominoType | null;
  queue?: TetrominoType[];
  disabled?: boolean;
  blockOpacity?: number; // 0.0 ~ 1.0
}

export const PiecePreview: React.FC<PiecePreviewProps> = ({
  title,
  pieceType,
  queue,
  disabled = false,
  blockOpacity = 0.85,
}) => {
  // Normalize any tetromino shape into a uniform, perfectly centered 4x4 grid
  const renderCentered4x4Piece = (type: TetrominoType | null, alphaMultiplier = 1) => {
    if (!type) {
      return (
        <div className="mini-grid-4x4">
          {Array.from({ length: 16 }).map((_, idx) => (
            <div key={idx} className="mini-cell empty" />
          ))}
        </div>
      );
    }

    const config = TETROMINOES[type];
    const rawShape = config.shapes[0]; // 2x2, 3x3, or 4x4

    // Create 4x4 canvas matrix
    const matrix4x4: number[][] = Array.from({ length: 4 }, () => [0, 0, 0, 0]);

    // Center offset calculation
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

    const effectiveOpacity = Math.max(0.0, blockOpacity * alphaMultiplier);

    return (
      <div className="mini-grid-4x4">
        {matrix4x4.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`mini-cell ${cell ? 'filled' : 'empty'}`}
              style={
                cell
                  ? {
                      backgroundColor: config.color,
                      boxShadow: `0 0 6px ${config.glowColor}`,
                      opacity: effectiveOpacity,
                      transition: 'opacity 0.15s ease',
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
    <div className={`glass-panel preview-panel ${disabled ? 'disabled' : ''}`}>
      <h3 className="panel-title">{title}</h3>
      <div className="preview-content">
        {queue ? (
          <div className="queue-list">
            {queue.map((qType, index) => (
              <div key={index} className="queue-item">
                {renderCentered4x4Piece(qType, 1 - index * 0.25)}
              </div>
            ))}
          </div>
        ) : (
          <div className="single-preview">{renderCentered4x4Piece(pieceType)}</div>
        )}
      </div>
    </div>
  );
};
