import { useState, useEffect } from 'react';
import { useTetris } from './hooks/useTetris';
import { TetrisBoard } from './components/TetrisBoard';
import { PiecePreview } from './components/PiecePreview';
import { ScoreBoard } from './components/ScoreBoard';
import { TouchControls } from './components/TouchControls';
import { ControlsModal } from './components/ControlsModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  Gamepad2,
  Sliders,
  Sun,
  Moon,
  EyeOff,
  FileText,
  FileSpreadsheet,
  Plus,
  Square,
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
    endGame,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    hold,
    submitHighScore,
  } = useTetris();

  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
  const [cardOpacity, setCardOpacity] = useState(85);
  const [theme, setTheme] = useState<'dark' | 'light' | 'excel'>('excel');
  const [isStealthMode, setIsStealthMode] = useState(false);

  // Update Theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === 'excel') return 'dark';
      if (prev === 'dark') return 'light';
      return 'excel';
    });
  };

  const toggleStealth = () => {
    setIsStealthMode((prev) => {
      const next = !prev;
      if (next && gameState === 'PLAYING') {
        togglePause();
      }
      return next;
    });
  };

  // Keyboard Event Listeners (including Boss Key 'B')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        toggleStealth();
        return;
      }

      if (isStealthMode) return;

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
    isStealthMode,
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
      {/* Camouflage Fake Document Overlay (몰컴 모드) */}
      {isStealthMode && (
        <div className="stealth-overlay">
          <div className="stealth-doc-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={24} color="#0284c7" />
              <span className="stealth-doc-title">2026_하반기_사업계획서_및_실적분석_보고서.docx</span>
            </div>
            <button className="stealth-restore-btn" onClick={toggleStealth}>
              게임 복귀 (단축키: B)
            </button>
          </div>

          <div className="stealth-doc-body">
            <h2>1. 프로젝트 진행 경과 및 핵심 KPI 요약</h2>
            <p style={{ margin: '0.75rem 0', lineHeight: '1.6', color: '#475569' }}>
              본 보고서는 2026년 하반기 주요 사업부별 실적 지표 및 목표 달성률을 종합 분석한 자료입니다.
              지속적인 서비스 모니터링과 프로세스 개선을 통해 전분기 대비 14.8%의 효율성 증대를 기록하였습니다.
            </p>

            <table className="stealth-table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>목표 지표</th>
                  <th>달성 실적</th>
                  <th>달성률</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>시스템 최적화</td>
                  <td>98.5%</td>
                  <td>99.2%</td>
                  <td>100.7%</td>
                  <td>정상 가동</td>
                </tr>
                <tr>
                  <td>사용자 만족도</td>
                  <td>90.0점</td>
                  <td>94.5점</td>
                  <td>105.0%</td>
                  <td>우수</td>
                </tr>
                <tr>
                  <td>보안 및 접근 제어</td>
                  <td>100%</td>
                  <td>100%</td>
                  <td>100%</td>
                  <td>이상 없음</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fixed Top Header Navigation */}
      <header className="header-bar">
        <div className="logo-group">
          {theme === 'excel' ? (
            <FileSpreadsheet size={20} color="#ffffff" />
          ) : (
            <Gamepad2 size={24} className="text-cyan-400" />
          )}
          <h1 className="game-title">
            {theme === 'excel' ? 'Microsoft Excel - 2026_실적분석.xlsx' : 'CYBER TETRIS'}
          </h1>
        </div>

        <div className="header-actions">
          {/* Boss Key / Stealth Mode Toggle Button */}
          <button
            className={`icon-btn ${isStealthMode ? 'stealth-active' : ''}`}
            onClick={toggleStealth}
            title="몰컴 모드 (단축키: B) - 보고서 위장 화면"
          >
            <EyeOff size={16} />
            <span>몰컴(B)</span>
          </button>

          {/* Theme Toggle Button (Excel -> Dark -> Light) */}
          <button className="icon-btn" onClick={cycleTheme} title="테마 전환 (엑셀/네온/라이트)">
            {theme === 'excel' && <FileSpreadsheet size={16} className="text-emerald-400" />}
            {theme === 'dark' && <Sun size={16} className="text-yellow-400" />}
            {theme === 'light' && <Moon size={16} className="text-blue-500" />}
            <span>{theme === 'excel' ? '엑셀' : theme === 'dark' ? '네온' : '라이트'}</span>
          </button>

          {/* Sound Toggle Button */}
          <button className="icon-btn" onClick={toggleSound} title="사운드 온/오프">
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Controls Guide Button */}
          <button
            className="icon-btn"
            onClick={() => setIsControlsModalOpen(true)}
            title="조작법"
          >
            <HelpCircle size={16} />
            <span>조작법</span>
          </button>
        </div>
      </header>

      {/* Excel Mode Formula Bar */}
      <div className="excel-formula-bar">
        <span className="fx-label">fx</span>
        <span className="fx-text">
          =SUM(SCORE: {stats.score}, LEVEL: {stats.level}, LINES: {stats.lines}, HIGH: {stats.highScore})
        </span>
      </div>

      {/* Dedicated Full-Width Transparency Control Row */}
      <div className="opacity-slider-row" title="블록 투명도 섬세 조절 (0% ~ 100%)">
        <label htmlFor="opacity-range" className="opacity-slider-label">
          <Sliders size={14} />
          <span>블록 투명도</span>
        </label>
        <input
          id="opacity-range"
          type="range"
          min="0"
          max="100"
          value={cardOpacity}
          onChange={(e) => setCardOpacity(Number(e.target.value))}
          className="opacity-slider-wide"
        />
        <span className="opacity-value">{cardOpacity}%</span>
      </div>

      {/* Main Game Section */}
      <main className="game-layout">
        {/* Left Side Column: Hold Piece & Controls */}
        <div className="side-column side-column-left">
          <PiecePreview
            title="HOLD"
            pieceType={holdPieceType}
            disabled={!canHold}
            blockOpacity={cardOpacity / 100}
          />

          <div className="glass-panel game-controls-panel">
            <h3 className="panel-title">MENU</h3>
            {gameState === 'IDLE' ? (
              <button className="neon-button primary-btn" onClick={startGame}>
                <Play size={16} /> 시작하기
              </button>
            ) : gameState === 'PLAYING' || gameState === 'PAUSED' ? (
              <div className="menu-btn-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <button className="neon-button" onClick={togglePause}>
                  {gameState === 'PAUSED' ? (
                    <>
                      <Play size={14} /> 재개
                    </>
                  ) : (
                    <>
                      <Pause size={14} /> 일시정지
                    </>
                  )}
                </button>
                {/* Red End Game Button below Pause */}
                <button className="end-game-btn" onClick={endGame} title="현재 게임 종료 및 점수 기록">
                  <Square size={13} /> 게임종료
                </button>
                <button
                  className="icon-btn"
                  onClick={startGame}
                  style={{ justifyContent: 'center', fontSize: '0.7rem', padding: '0.3rem' }}
                >
                  <RotateCcw size={13} /> 재시작
                </button>
              </div>
            ) : (
              <button className="neon-button primary-btn" onClick={startGame}>
                <RotateCcw size={16} /> 다시 시작
              </button>
            )}
          </div>
        </div>

        {/* Center: Main Canvas Grid */}
        <div className="center-board">
          {theme === 'excel' ? (
            <div className="excel-board-wrapper">
              <div className="excel-col-headers">
                <div style={{ width: '16px' }}></div>
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((col) => (
                  <div key={col} className="excel-col-cell">{col}</div>
                ))}
              </div>
              <div className="excel-board-body">
                <div className="excel-row-headers">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="excel-row-cell">{i + 1}</div>
                  ))}
                </div>
                <TetrisBoard
                  board={board}
                  currentPiece={currentPiece}
                  ghostPiece={ghostPiece}
                  blockOpacity={cardOpacity / 100}
                  theme={theme}
                />
              </div>
            </div>
          ) : (
            <TetrisBoard
              board={board}
              currentPiece={currentPiece}
              ghostPiece={ghostPiece}
              blockOpacity={cardOpacity / 100}
              theme={theme}
            />
          )}
        </div>

        {/* Right Side Column: Next Piece Queue & Scoreboard */}
        <div className="side-column side-column-right">
          <PiecePreview
            title="NEXT"
            pieceType={null}
            queue={nextQueue}
            blockOpacity={cardOpacity / 100}
          />
          <ScoreBoard stats={stats} />
        </div>
      </main>

      {/* Excel Sheet Bottom Tabs Bar */}
      <div className="excel-bottom-tabs">
        <div className="excel-tab">📊 Sheet1 (2026_실적분석)</div>
        <div style={{ padding: '0.2rem', cursor: 'pointer' }}><Plus size={14} /></div>
        <div style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>준비</div>
      </div>

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

      {/* Auto / Manual Pause Modal */}
      <PauseModal
        isOpen={gameState === 'PAUSED'}
        onResume={togglePause}
        onRestart={startGame}
      />

      {/* Game Over & High Score Submission Modal */}
      {gameState === 'GAMEOVER' && (
        <GameOverModal
          stats={stats}
          onRestart={startGame}
          onSubmitHighScore={submitHighScore}
        />
      )}
    </div>
  );
}

export default App;
