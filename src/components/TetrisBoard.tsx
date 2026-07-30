import React, { useEffect, useRef } from 'react';
import { BoardGrid, Piece } from '../types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils/tetris';

interface TetrisBoardProps {
  board: BoardGrid;
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
}

export const TetrisBoard: React.FC<TetrisBoardProps> = ({
  board,
  currentPiece,
  ghostPiece,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    const cellWidth = width / BOARD_WIDTH;
    const cellHeight = height / BOARD_HEIGHT;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background grid lines & glowing border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellWidth, 0);
      ctx.lineTo(x * cellWidth, height);
      ctx.stroke();
    }

    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellHeight);
      ctx.lineTo(width, y * cellHeight);
      ctx.stroke();
    }

    // Helper to draw a single cell block with rounded corners & neon gradient
    const drawBlock = (
      x: number,
      y: number,
      color: string,
      glowColor?: string,
      isGhost: boolean = false
    ) => {
      const px = x * cellWidth;
      const py = y * cellHeight;
      const gap = 1.5;
      const sizeX = cellWidth - gap * 2;
      const sizeY = cellHeight - gap * 2;

      ctx.save();

      if (isGhost) {
        // Draw ghost piece (stroke border outline)
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(px + gap, py + gap, sizeX, sizeY);
      } else {
        // Draw solid glowing neon block
        if (glowColor) {
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 10;
        }

        // Inner block gradient
        const grad = ctx.createLinearGradient(px, py, px + cellWidth, py + cellHeight);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, color);
        grad.addColorStop(1, '#000000');

        ctx.fillStyle = grad;
        ctx.fillRect(px + gap, py + gap, sizeX, sizeY);

        // Highlight inner border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px + gap + 1, py + gap + 1, sizeX - 2, sizeY - 2);
      }

      ctx.restore();
    };

    // 1. Draw locked grid blocks
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = board[y][x];
        if (cell && cell.filled) {
          drawBlock(x, y, cell.color, cell.glowColor);
        }
      }
    }

    // 2. Draw Ghost Piece (land projection)
    if (ghostPiece && currentPiece) {
      for (let y = 0; y < ghostPiece.shape.length; y++) {
        for (let x = 0; x < ghostPiece.shape[y].length; x++) {
          if (ghostPiece.shape[y][x] !== 0) {
            const bx = ghostPiece.pos.x + x;
            const by = ghostPiece.pos.y + y;
            if (by >= 0) {
              drawBlock(bx, by, ghostPiece.color, undefined, true);
            }
          }
        }
      }
    }

    // 3. Draw Current Active Piece
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const bx = currentPiece.pos.x + x;
            const by = currentPiece.pos.y + y;
            if (by >= 0) {
              drawBlock(bx, by, currentPiece.color, currentPiece.glowColor);
            }
          }
        }
      }
    }
  }, [board, currentPiece, ghostPiece]);

  return (
    <div className="canvas-container shadow-neon">
      <canvas
        ref={canvasRef}
        width={300}
        height={600}
        className="tetris-canvas"
      />
    </div>
  );
};
