import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  TetrominoType,
  Piece,
  BoardGrid,
  GameState,
  GameStats,
  LeaderboardEntry,
} from '../types/tetris';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  createEmptyBoard,
  BagRandomizer,
  createPiece,
  checkCollision,
  getRotatedPiece,
  getGhostPiece,
  calculateScore,
  calculateLevel,
  getDropInterval,
} from '../utils/tetris';
import { soundManager } from '../utils/audio';

const HIGH_SCORE_KEY = 'CYBER_TETRIS_HIGH_SCORE';
const HIGH_SCORE_NICK_KEY = 'CYBER_TETRIS_HIGH_SCORE_NICK';

export const useTetris = () => {
  const [board, setBoard] = useState<BoardGrid>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextQueue, setNextQueue] = useState<TetrominoType[]>([]);
  const [holdPieceType, setHoldPieceType] = useState<TetrominoType | null>(null);
  const [canHold, setCanHold] = useState<boolean>(true);
  const [gameState, setGameState] = useState<GameState>('IDLE');

  const [stats, setStats] = useState<GameStats>(() => {
    const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    const savedNick = localStorage.getItem(HIGH_SCORE_NICK_KEY);
    return {
      score: 0,
      highScore: savedHighScore ? parseInt(savedHighScore, 10) : 10000,
      highScoreNickname: savedNick || 'CYBER_LEGEND',
      level: 1,
      lines: 0,
      combo: -1,
      topScores: [],
    };
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  // Refs
  const bagRef = useRef<BagRandomizer>(new BagRandomizer());
  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  // Fetch Server High Score & Leaderboard on Initial Load
  useEffect(() => {
    const fetchServerHighScore = async () => {
      try {
        const res = await fetch('/api/highscore');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.highScore === 'number') {
            setStats((prev) => {
              const bestScore = Math.max(prev.highScore, data.highScore);
              return {
                ...prev,
                highScore: bestScore,
                highScoreNickname: data.nickname || prev.highScoreNickname,
                topScores: data.topScores || [],
              };
            });
          }
        }
      } catch {
        // Fallback to local storage if offline
      }
    };

    fetchServerHighScore();
  }, []);

  // Submit new high score & nickname to Server
  const submitHighScore = useCallback(async (nickname: string, scoreToSubmit: number) => {
    const cleanNick = nickname.trim().slice(0, 12) || '익명';
    localStorage.setItem(HIGH_SCORE_KEY, scoreToSubmit.toString());
    localStorage.setItem(HIGH_SCORE_NICK_KEY, cleanNick);

    setStats((prev) => ({
      ...prev,
      highScore: scoreToSubmit,
      highScoreNickname: cleanNick,
    }));

    try {
      const res = await fetch('/api/highscore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: cleanNick, score: scoreToSubmit }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.globalRecord) {
          setStats((prev) => ({
            ...prev,
            highScore: data.globalRecord.highScore,
            highScoreNickname: data.globalRecord.nickname,
            topScores: data.globalRecord.topScores,
          }));
        }
      }
    } catch {
      // Offline fallback
    }
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      soundManager.setSoundEnabled(next);
      return next;
    });
  }, []);

  // Lock current piece & check line clears
  const lockPiece = useCallback((pieceToLock: Piece, currentBoard: BoardGrid) => {
    const newBoard = currentBoard.map((row) => [...row]);

    for (let y = 0; y < pieceToLock.shape.length; y++) {
      for (let x = 0; x < pieceToLock.shape[y].length; x++) {
        if (pieceToLock.shape[y][x] !== 0) {
          const boardY = pieceToLock.pos.y + y;
          const boardX = pieceToLock.pos.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = {
              filled: true,
              color: pieceToLock.color,
              glowColor: pieceToLock.glowColor,
            };
          }
        }
      }
    }

    let clearedLinesCount = 0;
    const filteredBoard = newBoard.filter((row) => {
      const isFull = row.every((cell) => cell !== null);
      if (isFull) clearedLinesCount++;
      return !isFull;
    });

    while (filteredBoard.length < BOARD_HEIGHT) {
      filteredBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
    }

    if (clearedLinesCount > 0) {
      soundManager.playLineClear(clearedLinesCount);
      if (clearedLinesCount === 4) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      setStats((prev) => {
        const newLines = prev.lines + clearedLinesCount;
        const newCombo = prev.combo + 1;
        const addedScore = calculateScore(clearedLinesCount, prev.level, newCombo);
        const newScore = prev.score + addedScore;
        const newLevel = calculateLevel(newScore, newLines); // Dynamic level every 10,000 pts

        return {
          ...prev,
          lines: newLines,
          score: newScore,
          combo: newCombo,
          level: newLevel,
        };
      });
    } else {
      setStats((prev) => ({ ...prev, combo: -1 }));
    }

    setBoard(filteredBoard);

    setNextQueue((prevQueue) => {
      const queueCopy = [...prevQueue];
      const nextType = queueCopy.shift() || bagRef.current.next();
      while (queueCopy.length < 3) {
        queueCopy.push(bagRef.current.next());
      }

      const nextPiece = createPiece(nextType);

      if (checkCollision(nextPiece, filteredBoard)) {
        soundManager.playGameOver();
        setGameState('GAMEOVER');
        setCurrentPiece(null);
      } else {
        setCurrentPiece(nextPiece);
      }

      return queueCopy;
    });

    setCanHold(true);
  }, []);

  // Movement handlers
  const moveLeft = useCallback(() => {
    if (gameState !== 'PLAYING' || !currentPiece) return;
    if (!checkCollision(currentPiece, board, { x: -1, y: 0 })) {
      soundManager.playMove();
      setCurrentPiece((prev) => prev ? { ...prev, pos: { ...prev.pos, x: prev.pos.x - 1 } } : null);
    }
  }, [gameState, currentPiece, board]);

  const moveRight = useCallback(() => {
    if (gameState !== 'PLAYING' || !currentPiece) return;
    if (!checkCollision(currentPiece, board, { x: 1, y: 0 })) {
      soundManager.playMove();
      setCurrentPiece((prev) => prev ? { ...prev, pos: { ...prev.pos, x: prev.pos.x + 1 } } : null);
    }
  }, [gameState, currentPiece, board]);

  const rotate = useCallback((clockwise: boolean = true) => {
    if (gameState !== 'PLAYING' || !currentPiece) return;
    const rotated = getRotatedPiece(currentPiece, board, clockwise);
    if (rotated) {
      soundManager.playRotate();
      setCurrentPiece(rotated);
    }
  }, [gameState, currentPiece, board]);

  const softDrop = useCallback(() => {
    if (gameState !== 'PLAYING' || !currentPiece) return;
    if (!checkCollision(currentPiece, board, { x: 0, y: 1 })) {
      soundManager.playSoftDrop();
      setCurrentPiece((prev) => prev ? { ...prev, pos: { ...prev.pos, y: prev.pos.y + 1 } } : null);
      setStats((prev) => {
        const newScore = prev.score + 1;
        const newLevel = calculateLevel(newScore, prev.lines);
        return { ...prev, score: newScore, level: newLevel };
      });
    } else {
      lockPiece(currentPiece, board);
    }
  }, [gameState, currentPiece, board, lockPiece]);

  const hardDrop = useCallback(() => {
    if (gameState !== 'PLAYING' || !currentPiece) return;
    const ghost = getGhostPiece(currentPiece, board);
    const dropDistance = ghost.pos.y - currentPiece.pos.y;

    soundManager.playHardDrop();
    setStats((prev) => {
      const newScore = prev.score + dropDistance * 2;
      const newLevel = calculateLevel(newScore, prev.lines);
      return { ...prev, score: newScore, level: newLevel };
    });
    lockPiece(ghost, board);
  }, [gameState, currentPiece, board, lockPiece]);

  const hold = useCallback(() => {
    if (gameState !== 'PLAYING' || !currentPiece || !canHold) return;

    soundManager.playHold();
    const currentType = currentPiece.type;

    if (holdPieceType === null) {
      setHoldPieceType(currentType);
      setNextQueue((prevQueue) => {
        const queueCopy = [...prevQueue];
        const nextType = queueCopy.shift() || bagRef.current.next();
        while (queueCopy.length < 3) {
          queueCopy.push(bagRef.current.next());
        }
        setCurrentPiece(createPiece(nextType));
        return queueCopy;
      });
    } else {
      const newCurrentPiece = createPiece(holdPieceType);
      setHoldPieceType(currentType);
      setCurrentPiece(newCurrentPiece);
    }

    setCanHold(false);
  }, [gameState, currentPiece, canHold, holdPieceType]);

  const startGame = useCallback(() => {
    bagRef.current = new BagRandomizer();

    const initialQueue: TetrominoType[] = [
      bagRef.current.next(),
      bagRef.current.next(),
      bagRef.current.next(),
    ];
    const firstType = bagRef.current.next();

    setBoard(createEmptyBoard());
    setNextQueue(initialQueue);
    setCurrentPiece(createPiece(firstType));
    setHoldPieceType(null);
    setCanHold(true);
    setGameState('PLAYING');

    setStats((prev) => ({
      ...prev,
      score: 0,
      level: 1,
      lines: 0,
      combo: -1,
    }));
  }, []);

  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev === 'PLAYING') return 'PAUSED';
      if (prev === 'PAUSED') return 'PLAYING';
      return prev;
    });
  }, []);

  // Main game tick loop with speed scaling per level
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = getDropInterval(stats.level);

    const tick = (time: number) => {
      if (!lastTickRef.current) lastTickRef.current = time;
      const delta = time - lastTickRef.current;

      if (delta >= interval) {
        lastTickRef.current = time;
        if (currentPiece) {
          if (!checkCollision(currentPiece, board, { x: 0, y: 1 })) {
            setCurrentPiece((prev) => prev ? { ...prev, pos: { ...prev.pos, y: prev.pos.y + 1 } } : null);
          } else {
            lockPiece(currentPiece, board);
          }
        }
      }

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, currentPiece, board, stats.level, lockPiece]);

  return {
    board,
    currentPiece,
    ghostPiece: currentPiece ? getGhostPiece(currentPiece, board) : null,
    nextQueue,
    holdPieceType,
    canHold,
    gameState,
    stats,
    soundEnabled,
    toggleSound,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    hold,
    submitHighScore,
  };
};
