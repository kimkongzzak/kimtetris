import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  TetrominoType,
  Piece,
  BoardGrid,
  GameState,
  GameStats,
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
import { getTopScoresFromDb, saveScoreToDb, isSupabaseConfigured } from '../lib/supabase';

const HIGH_SCORE_KEY = 'CYBER_TETRIS_HIGH_SCORE';
const HIGH_SCORE_NICK_KEY = 'CYBER_TETRIS_HIGH_SCORE_NICK';

const LOCK_DELAY_MS = 500; // 500ms lock delay before hard locking to floor
const MAX_LOCK_RESETS = 15; // Max 15 moves on floor before locking

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

  // Lock Delay refs
  const lockDelayTimerRef = useRef<number | null>(null);
  const lockResetCountRef = useRef<number>(0);

  // Fetch Server High Score & Leaderboard on Initial Load
  useEffect(() => {
    const fetchServerHighScore = async () => {
      if (isSupabaseConfigured) {
        const dbScores = await getTopScoresFromDb(10);
        if (dbScores.length > 0) {
          const topScores = dbScores.map((item) => ({
            nickname: item.nickname,
            score: item.score,
            date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          }));
          setStats((prev) => ({
            ...prev,
            highScore: Math.max(prev.highScore, topScores[0].score),
            highScoreNickname: topScores[0].nickname || prev.highScoreNickname,
            topScores,
          }));
          return;
        }
      }

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

  // Clear Lock Delay Helper
  const clearLockDelay = useCallback(() => {
    if (lockDelayTimerRef.current !== null) {
      clearTimeout(lockDelayTimerRef.current);
      lockDelayTimerRef.current = null;
    }
  }, []);

  // Window Focus Out / Visibility Change -> Auto Pause
  useEffect(() => {
    const handleBlur = () => {
      setGameState((prev) => (prev === 'PLAYING' ? 'PAUSED' : prev));
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setGameState((prev) => (prev === 'PLAYING' ? 'PAUSED' : prev));
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Submit new high score & nickname to Server / Supabase DB
  const submitHighScore = useCallback(async (nickname: string, scoreToSubmit: number) => {
    const cleanNick = nickname.trim().slice(0, 12) || '익명';
    localStorage.setItem(HIGH_SCORE_KEY, scoreToSubmit.toString());
    localStorage.setItem(HIGH_SCORE_NICK_KEY, cleanNick);

    setStats((prev) => ({
      ...prev,
      highScore: Math.max(prev.highScore, scoreToSubmit),
      highScoreNickname: cleanNick,
    }));

    if (isSupabaseConfigured) {
      await saveScoreToDb(cleanNick, scoreToSubmit);
      const updatedScores = await getTopScoresFromDb(10);
      if (updatedScores.length > 0) {
        const topScores = updatedScores.map((item) => ({
          nickname: item.nickname,
          score: item.score,
          date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        setStats((prev) => ({
          ...prev,
          highScore: topScores[0].score,
          highScoreNickname: topScores[0].nickname,
          topScores,
        }));
      }
    }

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
    clearLockDelay();
    lockResetCountRef.current = 0;

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
        const newLevel = calculateLevel(newScore, newLines);

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
  }, [clearLockDelay]);

  // Refresh Lock Delay on valid movement/rotation near bottom
  const refreshLockDelayIfGrounded = useCallback((pieceCandidate: Piece) => {
    if (checkCollision(pieceCandidate, board, { x: 0, y: 1 })) {
      if (lockResetCountRef.current < MAX_LOCK_RESETS) {
        clearLockDelay();
        lockResetCountRef.current++;
        lockDelayTimerRef.current = window.setTimeout(() => {
          lockPiece(pieceCandidate, board);
        }, LOCK_DELAY_MS);
      }
    }
  }, [board, clearLockDelay, lockPiece]);

  // Movement handlers with Lock Delay refresh
  const moveLeft = useCallback(() => {
    if (gameState !== 'PLAYING' || !currentPiece) return;
    if (!checkCollision(currentPiece, board, { x: -1, y: 0 })) {
      soundManager.playMove();
      const updated = { ...currentPiece, pos: { ...currentPiece.pos, x: currentPiece.pos.x - 1 } };
      setCurrentPiece(updated);
      refreshLockDelayIfGrounded(updated);
    }
  }, [gameState, currentPiece, board, refreshLockDelayIfGrounded]);

  const moveRight = useCallback(() => {
    if (gameState !== 'PLAYING' || !currentPiece) return;
    if (!checkCollision(currentPiece, board, { x: 1, y: 0 })) {
      soundManager.playMove();
      const updated = { ...currentPiece, pos: { ...currentPiece.pos, x: currentPiece.pos.x + 1 } };
      setCurrentPiece(updated);
      refreshLockDelayIfGrounded(updated);
    }
  }, [gameState, currentPiece, board, refreshLockDelayIfGrounded]);

  const rotate = useCallback((clockwise: boolean = true) => {
    if (gameState !== 'PLAYING' || !currentPiece) return;
    const rotated = getRotatedPiece(currentPiece, board, clockwise);
    if (rotated) {
      soundManager.playRotate();
      setCurrentPiece(rotated);
      refreshLockDelayIfGrounded(rotated);
    }
  }, [gameState, currentPiece, board, refreshLockDelayIfGrounded]);

  // Dedicated T-Spin Action
  const tSpin = useCallback(() => {
    if (gameState !== 'PLAYING' || !currentPiece) return;
    const rotated = getRotatedPiece(currentPiece, board, true);
    if (rotated) {
      soundManager.playRotate();
      setCurrentPiece(rotated);
      refreshLockDelayIfGrounded(rotated);

      if (currentPiece.type === 'T') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setStats((prev) => ({ ...prev, score: prev.score + 400 * prev.level }));
      }
    }
  }, [gameState, currentPiece, board, refreshLockDelayIfGrounded]);

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
    clearLockDelay();
    const ghost = getGhostPiece(currentPiece, board);
    const dropDistance = ghost.pos.y - currentPiece.pos.y;

    soundManager.playHardDrop();
    setStats((prev) => {
      const newScore = prev.score + dropDistance * 2;
      const newLevel = calculateLevel(newScore, prev.lines);
      return { ...prev, score: newScore, level: newLevel };
    });
    lockPiece(ghost, board);
  }, [gameState, currentPiece, board, lockPiece, clearLockDelay]);

  const hold = useCallback(() => {
    if (gameState !== 'PLAYING' || !currentPiece || !canHold) return;
    clearLockDelay();
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
  }, [gameState, currentPiece, canHold, holdPieceType, clearLockDelay]);

  const startGame = useCallback(() => {
    clearLockDelay();
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
  }, [clearLockDelay]);

  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev === 'PLAYING') return 'PAUSED';
      if (prev === 'PAUSED') return 'PLAYING';
      return prev;
    });
  }, []);

  const endGame = useCallback(() => {
    clearLockDelay();
    soundManager.playGameOver();
    setGameState('GAMEOVER');
  }, [clearLockDelay]);

  // Main game tick loop with 500ms Lock Delay when grounded
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
            clearLockDelay();
            setCurrentPiece((prev) => prev ? { ...prev, pos: { ...prev.pos, y: prev.pos.y + 1 } } : null);
          } else {
            // Touched bottom: Start 500ms lock delay if not already active
            if (lockDelayTimerRef.current === null) {
              lockDelayTimerRef.current = window.setTimeout(() => {
                lockPiece(currentPiece, board);
              }, LOCK_DELAY_MS);
            }
          }
        }
      }

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, currentPiece, board, stats.level, lockPiece, clearLockDelay]);

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
    endGame,
    moveLeft,
    moveRight,
    rotate,
    tSpin,
    softDrop,
    hardDrop,
    hold,
    submitHighScore,
  };
};
