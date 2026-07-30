import { useState, useEffect } from 'react';
import { useTetris } from './hooks/useTetris';
import { TetrisBoard } from './components/TetrisBoard';
import { PiecePreview } from './components/PiecePreview';
import { ScoreBoard } from './components/ScoreBoard';
import { TouchControls } from './components/TouchControls';
import { ControlsModal } from './components/ControlsModal';
import { GameOverModal } from './components/GameOverModal';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  Gamepad2,
} from 'lucide-react';

export function App() {
  const {
    board,
    currentPiece,
    ghostPiece,
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
  } = useTetris();

  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default page scroll on game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameState === 'GAMEOVER') return;

      switch (e.key) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowUp':
        case 'x':
        case 'X':
          rotate(true);
          break;
        case 'z':
        case 'Z':
          rotate(false);
          break;
        case 'ArrowDown':
          softDrop();
          break;
        case ' ':
          hardDrop();
          break;
        case 'c':
        case 'C':
        case 'Shift':
          hold();
          break;
        case 'p':
        case 'P':
        case 'Escape':
          togglePause();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    hold,
    togglePause,
  ]);

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      <header className="header-bar">
        <div className="logo-group">
          <Gamepad2 size={28} className="text-cyan-400" />
          <h1 className="game-title">CYBER TETRIS</h1>
        </div>

        <div className="header-actions">
          <button className="icon-btn" onClick={toggleSound} title="사운드 온/오프">
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            className="icon-btn"
            onClick={() => setIsControlsModalOpen(true)}
            title="조작법"
          >
            <HelpCircle size={18} />
            <span>조작법</span>
          </button>
        </div>
      </header>

      {/* Main Game Section */}
      <main className="game-layout">
        {/* Left Side Column: Hold Piece & Controls */}
        <div className="side-column side-column-left">
          <PiecePreview
            title="HOLD"
            pieceType={holdPieceType}
            disabled={!canHold}
          />

          <div className="glass-panel game-controls-panel">
            <h3 className="panel-title">MENU</h3>
            {gameState === 'IDLE' ? (
              <button className="neon-button primary-btn" onClick={startGame}>
                <Play size={18} /> 시작하기
              </button>
            ) : gameState === 'PLAYING' || gameState === 'PAUSED' ? (
              <div className="menu-btn-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button className="neon-button" onClick={togglePause}>
                  {gameState === 'PAUSED' ? (
                    <>
                      <Play size={18} /> 재개
                    </>
                  ) : (
                    <>
                      <Pause size={18} /> 일시정지
                    </>
                  )}
                </button>
                <button
                  className="icon-btn"
                  onClick={startGame}
                  style={{ justifyContent: 'center' }}
                >
                  <RotateCcw size={16} /> 재시작
                </button>
              </div>
            ) : (
              <button className="neon-button primary-btn" onClick={startGame}>
                <RotateCcw size={18} /> 다시 시작
              </button>
            )}
          </div>
        </div>

        {/* Center: Main Canvas Grid */}
        <div className="center-board">
          <TetrisBoard
            board={board}
            currentPiece={currentPiece}
            ghostPiece={ghostPiece}
          />
        </div>

        {/* Right Side Column: Next Piece Queue & Scoreboard */}
        <div className="side-column side-column-right">
          <PiecePreview title="NEXT" pieceType={null} queue={nextQueue} />
          <ScoreBoard stats={stats} />
        </div>
      </main>

      {/* Mobile Screen Touch Controls */}
      <TouchControls
        onMoveLeft={moveLeft}
        onMoveRight={moveRight}
        onRotate={() => rotate(true)}
        onSoftDrop={softDrop}
        onHardDrop={hardDrop}
        onHold={hold}
        disabled={gameState !== 'PLAYING'}
      />

      {/* Modals */}
      <ControlsModal
        isOpen={isControlsModalOpen}
        onClose={() => setIsControlsModalOpen(false)}
      />

      {gameState === 'GAMEOVER' && (
        <GameOverModal stats={stats} onRestart={startGame} />
      )}
    </div>
  );
}

export default App;
