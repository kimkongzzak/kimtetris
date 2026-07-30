import React from 'react';
import { TetrominoType } from '../types/tetris';
import { TETROMINOES } from '../utils/tetris';

interface PiecePreviewProps {
  title: string;
  pieceType: TetrominoType | null;
  queue?: TetrominoType[];
  disabled?: boolean;
}

export const PiecePreview: React.FC<PiecePreviewProps> = ({
  title,
  pieceType,
  queue,
  disabled = false,
}) => {
  const renderMiniPiece = (type: TetrominoType | null, opacity = 1) => {
    if (!type) return <div className="mini-grid-empty" />;

    const config = TETROMINOES[type];
    const shape = config.shapes[0];

    return (
      <div
        className="mini-grid"
        style={{
          gridTemplateColumns: `repeat(${shape[0].length}, 1fr)`,
          opacity: opacity,
        }}
      >
        {shape.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`mini-cell ${cell ? 'filled' : ''}`}
              style={
                cell
                  ? {
                      backgroundColor: config.color,
                      boxShadow: `0 0 8px ${config.glowColor}`,
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
                {renderMiniPiece(qType, 1 - index * 0.25)}
              </div>
            ))}
          </div>
        ) : (
          <div className="single-preview">{renderMiniPiece(pieceType)}</div>
        )}
      </div>
    </div>
  );
};
