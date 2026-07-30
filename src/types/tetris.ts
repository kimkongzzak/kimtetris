export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type RotationState = 0 | 1 | 2 | 3;

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: TetrominoType;
  shape: number[][];
  rotation: RotationState;
  pos: Position;
  color: string;
  glowColor: string;
}

export type GridCell = {
  filled: boolean;
  color: string;
  glowColor?: string;
} | null;

export type BoardGrid = GridCell[][];

export type GameState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  date: string;
}

export interface GameStats {
  score: number;
  highScore: number;
  highScoreNickname: string;
  level: number;
  lines: number;
  combo: number;
  topScores?: LeaderboardEntry[];
}

export interface AudioSettings {
  soundEnabled: boolean;
  volume: number;
}
