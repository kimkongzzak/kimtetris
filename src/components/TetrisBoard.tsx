import React, { useEffect, useRef } from 'react';
import { BoardGrid, Piece } from '../types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils/tetris';

interface TetrisBoardProps {
  board: BoardGrid;
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
  opacity?: number; // 0.0 ~ 1.0
  theme?: 'dark' | 'light' | 'excel';
}

const EXCEL_COLORS: Record<string, string> = {
  I: '#0284c7',
  J: '#1d4ed8',
  L: '#d97706',
  O: '#ca8a04',
  S: '#16a34a',
  T: '#9333ea',
  Z: '#dc2626',
};

export const TetrisBoard: React.FC<TetrisBoardProps> = ({
  board,
  currentPiece,
  ghostPiece,
  opacity = 0.85,
  theme = 'dark',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isExcel = theme === 'excel';

    // Get canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    const cellWidth = width / BOARD_WIDTH;
    const cellHeight = height / BOARD_HEIGHT;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set canvas global alpha based on opacity slider
    ctx.globalAlpha = Math.max(0.01, opacity);

    // Fill canvas background
    if (isExcel) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    // Draw background grid lines
    ctx.strokeStyle = isExcel ? '#d4d4d4' : 'rgba(255, 255, 255, 0.08)';
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

    // Helper to draw a single cell block
    const drawBlock = (
      x: number,
      y: number,
      color: string,
      glowColor?: string,
      isGhost: boolean = false,
      pieceType?: string
    ) => {
      const px = x * cellWidth;
      const py = y * cellHeight;
      const gap = isExcel ? 0.5 : 1.5;
      const sizeX = cellWidth - gap * 2;
      const sizeY = cellHeight - gap * 2;

      ctx.save();

      if (isExcel) {
        // Excel spreadsheet cell rendering
        if (isGhost) {
          // Excel selected cell range green border outline
          ctx.strokeStyle = '#107c41';
          ctx.lineWidth = 2;
          ctx.strokeRect(px + 1, py + 1, cellWidth - 2, cellHeight - 2);
          ctx.fillStyle = 'rgba(16, 124, 65, 0.15)';
          ctx.fillRect(px + 1, py + 1, cellWidth - 2, cellHeight - 2);
        } else {
          const excelColor = (pieceType && EXCEL_COLORS[pieceType]) || color;
          ctx.fillStyle = excelColor;
          ctx.fillRect(px, py, cellWidth, cellHeight);

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, cellWidth, cellHeight);
        }
      } else {
        // Cyberpunk / Light theme rendering
        if (isGhost) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(px + gap, py + gap, sizeX, sizeY);
        } else {
          if (glowColor) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 10;
          }

          const grad = ctx.createLinearGradient(px, py, px + cellWidth, py + cellHeight);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, color);
          grad.addColorStop(1, '#000000');

          ctx.fillStyle = grad;
          ctx.fillRect(px + gap, py + gap, sizeX, sizeY);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px + gap + 1, py + gap + 1, sizeX - 2, sizeY - 2);
        }
      }

      ctx.restore();
    };

    // 1. Draw locked grid blocks
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = board[y][x];
        if (cell && cell.filled) {
          drawBlock(x, y, cell.color, cell.glowColor, false);
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
              drawBlock(bx, by, ghostPiece.color, undefined, true, ghostPiece.type);
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
              drawBlock(bx, by, currentPiece.color, currentPiece.glowColor, false, currentPiece.type);
            }
          }
        }
      }
    }
  }, [board, currentPiece, ghostPiece, opacity, theme]);

  return (
    <div className={`canvas-container ${theme === 'excel' ? 'excel-canvas-mode' : 'shadow-neon'}`}>
      <canvas
        ref={canvasRef}
        width={300}
        height={600}
        className="tetris-canvas"
      />
    </div>
  );
};
