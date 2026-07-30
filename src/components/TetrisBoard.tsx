import React, { useEffect, useRef } from 'react';
import { BoardGrid, Piece } from '../types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils/tetris';

interface TetrisBoardProps {
  board: BoardGrid;
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
  blockOpacity?: number; // 0.0 ~ 1.0 (Controls block colors transparency ONLY)
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

const EXCEL_COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const TetrisBoard: React.FC<TetrisBoardProps> = ({
  board,
  currentPiece,
  ghostPiece,
  blockOpacity = 0.85,
  theme = 'excel',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isExcel = theme === 'excel';

  // Canvas Dimensions
  const headerOffsetX = isExcel ? 24 : 0;
  const headerOffsetY = isExcel ? 24 : 0;
  const canvasWidth = 300 + headerOffsetX;
  const canvasHeight = 600 + headerOffsetY;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellWidth = 300 / BOARD_WIDTH; // 30px per cell
    const cellHeight = 600 / BOARD_HEIGHT; // 30px per cell

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw Excel Headers & Grid Background
    ctx.globalAlpha = 1.0;

    if (isExcel) {
      // White background for board canvas area
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(headerOffsetX, headerOffsetY, 300, 600);

      // Top-Left Corner Spacer Cell
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, headerOffsetX, headerOffsetY);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, headerOffsetX, headerOffsetY);

      // Top Column Headers ('A' ~ 'J')
      ctx.font = 'bold 11px Segoe UI, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let c = 0; c < BOARD_WIDTH; c++) {
        const cx = headerOffsetX + c * cellWidth;
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(cx, 0, cellWidth, headerOffsetY);
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(cx, 0, cellWidth, headerOffsetY);

        ctx.fillStyle = '#475569';
        ctx.fillText(EXCEL_COLS[c], cx + cellWidth / 2, headerOffsetY / 2 + 1);
      }

      // Left Row Headers ('1' ~ '20')
      ctx.font = 'bold 10px Segoe UI, Arial, sans-serif';

      for (let r = 0; r < BOARD_HEIGHT; r++) {
        const ry = headerOffsetY + r * cellHeight;
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, ry, headerOffsetX, cellHeight);
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(0, ry, headerOffsetX, cellHeight);

        ctx.fillStyle = '#475569';
        ctx.fillText(String(r + 1), headerOffsetX / 2, ry + cellHeight / 2 + 1);
      }
    }

    // Grid lines for board
    ctx.strokeStyle = isExcel ? '#d4d4d4' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(headerOffsetX + x * cellWidth, headerOffsetY);
      ctx.lineTo(headerOffsetX + x * cellWidth, headerOffsetY + 600);
      ctx.stroke();
    }

    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(headerOffsetX, headerOffsetY + y * cellHeight);
      ctx.lineTo(headerOffsetX + 300, headerOffsetY + y * cellHeight);
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
      const px = headerOffsetX + x * cellWidth;
      const py = headerOffsetY + y * cellHeight;
      const gap = isExcel ? 0.5 : 1.5;
      const sizeX = cellWidth - gap * 2;
      const sizeY = cellHeight - gap * 2;

      ctx.save();
      ctx.globalAlpha = Math.max(0.0, blockOpacity);

      if (isExcel) {
        if (isGhost) {
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

    // 2. Draw locked grid blocks with blockOpacity
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = board[y][x];
        if (cell && cell.filled) {
          drawBlock(x, y, cell.color, cell.glowColor, false);
        }
      }
    }

    // 3. Draw Ghost Piece
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

    // 4. Draw Current Active Piece
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
  }, [board, currentPiece, ghostPiece, blockOpacity, theme, canvasWidth, canvasHeight, headerOffsetX, headerOffsetY, isExcel]);

  return (
    <div className={`canvas-container ${isExcel ? 'excel-canvas-mode' : 'shadow-neon'}`}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="tetris-canvas"
        style={{ aspectRatio: `${canvasWidth} / ${canvasHeight}` }}
      />
    </div>
  );
};
