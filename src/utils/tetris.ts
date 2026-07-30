import { TetrominoType, Piece, BoardGrid, RotationState, Position } from '../types/tetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOES: Record<TetrominoType, {
  shapes: number[][][]; // 4 rotation states
  color: string;
  glowColor: string;
}> = {
  I: {
    shapes: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
    ],
    color: '#38bdf8', // Soft Sky Blue (눈 편한 하늘색)
    glowColor: 'rgba(56, 189, 248, 0.7)',
  },
  J: {
    shapes: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
    ],
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.8)',
  },
  L: {
    shapes: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ],
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.8)',
  },
  O: {
    shapes: [
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
    ],
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.8)',
  },
  S: {
    shapes: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
    color: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.8)',
  },
  T: {
    shapes: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.8)',
  },
  Z: {
    shapes: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
      ],
    ],
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.8)',
  },
};

export const createEmptyBoard = (): BoardGrid => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
};

export class BagRandomizer {
  private bag: TetrominoType[] = [];

  public next(): TetrominoType {
    if (this.bag.length === 0) {
      this.bag = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }
    return this.bag.pop()!;
  }
}

export const createPiece = (type: TetrominoType): Piece => {
  const config = TETROMINOES[type];
  const shape = config.shapes[0];
  const startX = Math.floor((BOARD_WIDTH - shape[0].length) / 2);
  return {
    type,
    shape,
    rotation: 0,
    pos: { x: startX, y: 0 },
    color: config.color,
    glowColor: config.glowColor,
  };
};

export const checkCollision = (
  piece: Piece,
  board: BoardGrid,
  moveOffset: { x: number; y: number } = { x: 0, y: 0 },
  customShape?: number[][]
): boolean => {
  const shape = customShape || piece.shape;
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const targetX = piece.pos.x + x + moveOffset.x;
        const targetY = piece.pos.y + y + moveOffset.y;

        if (targetX < 0 || targetX >= BOARD_WIDTH || targetY >= BOARD_HEIGHT) {
          return true;
        }

        if (targetY >= 0 && board[targetY] && board[targetY][targetX] !== null) {
          return true;
        }
      }
    }
  }
  return false;
};

const WALL_KICKS_NORMAL: Record<string, Position[]> = {
  '0-1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '1-0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  '1-2': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  '2-1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '2-3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  '3-2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  '3-0': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  '0-3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
};

const WALL_KICKS_I: Record<string, Position[]> = {
  '0-1': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
  '1-0': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
  '1-2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
  '2-1': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
  '2-3': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
  '3-2': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
  '3-0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
  '0-3': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
};

export const getRotatedPiece = (
  piece: Piece,
  board: BoardGrid,
  clockwise: boolean = true
): Piece | null => {
  const currentRot = piece.rotation;
  const nextRot = ((currentRot + (clockwise ? 1 : 3)) % 4) as RotationState;
  const nextShape = TETROMINOES[piece.type].shapes[nextRot];

  const key = `${currentRot}-${nextRot}`;
  const kicks = piece.type === 'I' ? WALL_KICKS_I[key] : WALL_KICKS_NORMAL[key] || [{ x: 0, y: 0 }];

  for (const kick of kicks) {
    const testPos = { x: piece.pos.x + kick.x, y: piece.pos.y - kick.y };
    const testPiece: Piece = {
      ...piece,
      rotation: nextRot,
      shape: nextShape,
      pos: testPos,
    };

    if (!checkCollision(testPiece, board)) {
      return testPiece;
    }
  }

  return null;
};

export const getGhostPiece = (piece: Piece, board: BoardGrid): Piece => {
  let ghostY = piece.pos.y;
  while (!checkCollision(piece, board, { x: 0, y: ghostY - piece.pos.y + 1 })) {
    ghostY++;
  }
  return {
    ...piece,
    pos: { x: piece.pos.x, y: ghostY },
  };
};

export const calculateScore = (linesCleared: number, level: number, combo: number): number => {
  const lineScores = [0, 100, 300, 500, 800];
  const baseScore = lineScores[linesCleared] || 0;
  const comboBonus = combo > 0 ? combo * 50 * level : 0;
  return (baseScore * level) + comboBonus;
};

export const calculateLevel = (score: number, lines: number): number => {
  const levelFromScore = Math.floor(score / 10000);
  const levelFromLines = Math.floor(lines / 10);
  return 1 + levelFromScore + levelFromLines;
};

export const getDropInterval = (level: number): number => {
  return Math.max(40, Math.floor(800 * Math.pow(0.88, level - 1)));
};
