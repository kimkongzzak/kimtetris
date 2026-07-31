# 🎮 KimTetris 프로젝트 구조 및 파일 역할 명세서 (Project Specification)

본 문서는 **KimTetris (웹 기반 반응형 테트리스 게임)** 프로젝트의 전체 디렉토리 구조, 기술 스택 및 언어별 사용 분야, 그리고 각 파일의 상세 역할과 소스 코드 위치 링크를 명시한 명세서입니다.

---

## 1. 🛠️ 기술 스택 및 언어별 사용 분야 (Languages & Tech Stack)

| 언어 / 기술 | 사용 분야 및 주요 역할 | 관련 주요 파일 |
| :--- | :--- | :--- |
| **TypeScript (v5.7.2)** | • 게임 도메인 모델 / 데이터 타입 정의<br>• 테트리스 순수 게임 로직, SRS 벽차기, 7-Bag 알고리즘<br>• 게임 상태 제어 커스텀 Hook (`useTetris`) 구현<br>• Supabase 클라이언트 통신 모듈 (`src/lib/supabase.ts`) 구축<br>• Vercel Serverless Function 백엔드 API | [`src/types/tetris.ts`](file:///c:/app/workspace/kimtetris/src/types/tetris.ts)<br>[`src/utils/tetris.ts`](file:///c:/app/workspace/kimtetris/src/utils/tetris.ts)<br>[`src/hooks/useTetris.ts`](file:///c:/app/workspace/kimtetris/src/hooks/useTetris.ts)<br>[`src/lib/supabase.ts`](file:///c:/app/workspace/kimtetris/src/lib/supabase.ts)<br>[`api/highscore.ts`](file:///c:/app/workspace/kimtetris/api/highscore.ts) |
| **React (v18.3.1) / TSX** | • 컴포넌트 기반 웹 사용자 인터페이스(UI) 구축<br>• 테트리스 보드, 넥스트/홀드 피스, 모달 팝업, 터치 컨트롤러 렌더링<br>• 상태 변화에 따른 유연한 DOM 업데이트 | [`src/App.tsx`](file:///c:/app/workspace/kimtetris/src/App.tsx)<br>[`src/components/*`](file:///c:/app/workspace/kimtetris/src/components) |
| **Supabase (PostgreSQL)** | • 클라우드 데이터베이스 연동 (`tetris_scores` 테이블)<br>• 글로벌 명예의 전당 점수 persistence 보장 (`YYYY-MM-DD HH:mm` 기록) | [`src/lib/supabase.ts`](file:///c:/app/workspace/kimtetris/src/lib/supabase.ts)<br>[`api/highscore.ts`](file:///c:/app/workspace/kimtetris/api/highscore.ts) |
| **HTML5 & Canvas 2D** | • 웹 DOM 엔트리 렌더링 (`index.html`)<br>• HTML5 Canvas 2D Context를 통한 10x20 그리드 및 엑셀 셀/A~J 알파벳 헤더 렌더링 | [`index.html`](file:///c:/app/workspace/kimtetris/index.html)<br>[`src/components/TetrisBoard.tsx`](file:///c:/app/workspace/kimtetris/src/components/TetrisBoard.tsx) |
| **CSS3 (Vanilla CSS)** | • Cyberpunk Neon 테마 & 엑셀 위장 스킨 스타일링<br>• Grid / Flexbox 기반 반응형 레이아웃, 키프레임 애니메이션 | [`src/index.css`](file:///c:/app/workspace/kimtetris/src/index.css) |
| **Web Audio API (JS/TS)** | • 음원 파일 없이 오디오 오실레이터(Oscillator)를 통해 테트리스 효과음 및 8-bit BGM 실시간 합성 | [`src/utils/audio.ts`](file:///c:/app/workspace/kimtetris/src/utils/audio.ts) |
| **Vite & Node.js** | • 빠른 HMR 개발 서버 및 TypeScript 모듈 번들링/빌드 환경 | [`vite.config.ts`](file:///c:/app/workspace/kimtetris/vite.config.ts)<br>[`package.json`](file:///c:/app/workspace/kimtetris/package.json) |

---

## 2. 📂 프로젝트 전체 디렉토리 구조 (Directory Tree)

```
kimtetris/
├── 📄 index.html             # 웹 앱 HTML 엔트리 포인트
├── 📄 package.json           # 프로젝트 의존성 및 스크립트 설정
├── 📄 tsconfig.json          # TypeScript 컴파일러 설정
├── 📄 vite.config.ts         # Vite 번들러 및 개발 서버 설정
├── 📄 vercel.json            # Vercel 배포 및 라우팅 설정
├── 📄 PROJECT_SPEC.md        # [본 문서] 최신 프로젝트 명세서
├── 📄 README.md              # 메인 README 문서
│
├── 📁 api/                   # Serverless Backend API
│   └── 📄 highscore.ts       # Supabase 연동 & In-Memory Fallback 리더보드 REST API
│
└── 📁 src/                   # Frontend React Application Source
    ├── 📄 main.tsx           # React ReactDOM 랜더링 진입점
    ├── 📄 App.tsx            # 메인 앱 레이아웃 및 모달/통신 조율 컴포넌트
    ├── 📄 index.css          # 네온 파이프라인 & 엑셀 스킨 전역 CSS
    │
    ├── 📁 lib/               # 클라우드 / 외부 서비스 모듈
    │   └── 📄 supabase.ts    # Supabase DB (`tetris_scores` 테이블) 클라이언트 & 쿼리 유틸
    │
    ├── 📁 types/             # TypeScript 타입/인터페이스 정의
    │   └── 📄 tetris.ts      # 테트리스 게임 객체/상태 타입 정의
    │
    ├── 📁 utils/             # 순수 유틸리티 함수 및 오디오 엔진
    │   ├── 📄 tetris.ts      # 테트로미노 모형, 충돌검사, SRS, 점수 계산 로직
    │   └── 📄 audio.ts       # Web Audio API 사운드합성 및 BGM 엔진
    │
    ├── 📁 hooks/             # Custom React Hooks
    │   └── 📄 useTetris.ts   # 핵심 게임 루프, 락 디레이, 키보드/터치 조작 핸들러
    │
    └── 📁 components/        # UI 컴포넌트 모듈
        ├── 📄 TetrisBoard.tsx    # Canvas 2D 10x20 테트리스 보드 & 엑셀 헤더 렌더러
        ├── 📄 PiecePreview.tsx   # Next (1~3개) & Hold 피스 미니 보드
        ├── 📄 ScoreBoard.tsx     # 점수, 레벨, 지운 줄 수, 하이스코어 표시
        ├── 📄 TouchControls.tsx  # 모바일/터치용 가상 D-Pad 컨트롤러
        ├── 📄 ControlsModal.tsx  # 키보드 조작법 설명 모달
        ├── 📄 PauseModal.tsx     # 일시정지 모달
        ├── 📄 GameOverModal.tsx  # 게임오버 점수 확인 & Supabase/서버 랭킹 등록 모달
        └── 📄 LeaderboardModal.tsx # 온라인 Top 10 명예의 전당 모달
```

---

## 3. 📄 파일별 상세 역할 명세 (File Specifications)

### 3.1. 백엔드 및 서벌리스 API ([`api/`](file:///c:/app/workspace/kimtetris/api))

* **[`api/highscore.ts`](file:///c:/app/workspace/kimtetris/api/highscore.ts)**
  * **언어**: TypeScript (Node.js / Vercel Serverless Function)
  * **역할**: 전 세계 사용자들의 최고 점수 및 Top 10 리더보드를 관리하는 API 엔드포인트입니다.
  * **주요 기능**:
    * **Supabase DB 우선 연동**: 환경변수가 존재할 경우 Supabase DB (`tetris_scores` 테이블)에서 Top 10 점수를 `created_at` 정렬하여 가져옴.
    * **In-Memory Fallback**: DB 미연동 시 서버 메모리 캐싱 데이터 반환.
    * `GET` (조회) / `POST` (새로운 점수 기록 등록) / CORS 헤더 완벽 지원.

---

### 3.2. 외부 데이터베이스 클라이언트 ([`src/lib/`](file:///c:/app/workspace/kimtetris/src/lib))

* **[`src/lib/supabase.ts`](file:///c:/app/workspace/kimtetris/src/lib/supabase.ts)**
  * **언어**: TypeScript
  * **역할**: Supabase Cloud DB와 직접 통신하는 프론트엔드 API 모듈.
  * **주요 유틸리티**:
    * `isSupabaseConfigured`: 환경변수 유무 검사.
    * `getTopScoresFromDb()`: Top 10 랭킹 쿼리 수행.
    * `saveScoreToDb()`: 닉네임과 점수를 DB에 안전하게 insert.
    * `formatDateWithTime()`: 날짜를 `YYYY-MM-DD HH:mm` 형태의 직관적인 한국 시각 포맷으로 변환.

---

### 3.3. 핵심 타입 및 유틸리티 ([`src/types/`](file:///c:/app/workspace/kimtetris/src/types), [`src/utils/`](file:///c:/app/workspace/kimtetris/src/utils))

* **[`src/types/tetris.ts`](file:///c:/app/workspace/kimtetris/src/types/tetris.ts)**
  * **언어**: TypeScript
  * **역할**: 게임 공통 데이터 모델 정의 (`TetrominoType`, `Piece`, `BoardGrid`, `GameState`, `LeaderboardEntry`, `GameStats` 등).

* **[`src/utils/tetris.ts`](file:///c:/app/workspace/kimtetris/src/utils/tetris.ts)**
  * **언어**: TypeScript (Pure Functions)
  * **역할**: 테트리스 공식 룰(Tetris Guideline) 규격 유틸리티 모음.
  * **주요 로직**:
    * `TETROMINOES`: 7가지 블록 모형, 4방향 회전 좌표 및 네온 컬러.
    * `BagRandomizer`: 7-Bag 공평한 랜덤 블록 생성기.
    * `checkCollision()`: 이동/회전 시 충돌 검사.
    * `getRotatedPiece()`: SRS (Super Rotation System) 표준 벽차기(Wall Kick) 연산.
    * `getGhostPiece()`: 수직 낙하 지점 고스트 블록 연산.
    * `calculateScore()`, `calculateLevel()`, `getDropInterval()`: 점수/레벨/낙하 속도 산출.

* **[`src/utils/audio.ts`](file:///c:/app/workspace/kimtetris/src/utils/audio.ts)**
  * **언어**: TypeScript (Web Audio API)
  * **역할**: 브라우저 오디오 오실레이터(OscillatorNode)를 통한 효과음 및 8-bit BGM 음원 즉석 생성기.

---

### 3.4. 커스텀 훅 및 상태 관리 ([`src/hooks/`](file:///c:/app/workspace/kimtetris/src/hooks))

* **[`src/hooks/useTetris.ts`](file:///c:/app/workspace/kimtetris/src/hooks/useTetris.ts)**
  * **언어**: TypeScript (React Custom Hook)
  * **역할**: 테트리스의 **핵심 게임 엔진 및 상태 제어기**.
  * **주요 기능**:
    * 게임 자동 낙하 타이머 관리 및 곡선 속도 가속 연산.
    * 락 디레이 (Lock Delay: 0.5초 유예시간) 및 Hold 피스 교체 처리.
    * 키보드/터치 입력 바인딩 및 라인 클리어, 콤보 연산, Confetti 연동.

---

### 3.5. 메인 프론트엔드 어플리케이션 ([`src/`](file:///c:/app/workspace/kimtetris/src))

* **[`src/main.tsx`](file:///c:/app/workspace/kimtetris/src/main.tsx)**
  * **언어**: TypeScript / React
  * **역할**: React 어플리케이션의 루트 Entry Point.

* **[`src/App.tsx`](file:///c:/app/workspace/kimtetris/src/App.tsx)**
  * **언어**: TypeScript / React (TSX)
  * **역할**: 메인 레이아웃, 오디오 볼륨 설정, 테마 선택(네온 vs 엑셀 스킨), Boss Key(`B`) 처리, 각 모달 제어 및 백엔드 API/Supabase 연동 조율.

* **[`src/index.css`](file:///c:/app/workspace/kimtetris/src/index.css)**
  * **언어**: CSS3
  * **역할**: 네온 테마 & 엑셀 위장 스킨 통합 CSS 스타일시트.

---

### 3.6. UI 컴포넌트 모듈 ([`src/components/`](file:///c:/app/workspace/kimtetris/src/components))

* **[`src/components/TetrisBoard.tsx`](file:///c:/app/workspace/kimtetris/src/components/TetrisBoard.tsx)**
  * **역할**: HTML5 Canvas 2D 10x20 보드 렌더러. 엑셀 스킨 선택 시 알파벳 헤더(A~J) 및 행번호(1~20)를 캔버스 내부에서 정밀 렌더링.

* **[`src/components/PiecePreview.tsx`](file:///c:/app/workspace/kimtetris/src/components/PiecePreview.tsx)**
  * **역할**: Next (1~3개) & Hold 피스 4x4 미니 격자 렌더러.

* **[`src/components/ScoreBoard.tsx`](file:///c:/app/workspace/kimtetris/src/components/ScoreBoard.tsx)**
  * **역할**: 현재 점수, 레벨, 지운 라인 수, 하이스코어 패널.

* **[`src/components/TouchControls.tsx`](file:///c:/app/workspace/kimtetris/src/components/TouchControls.tsx)**
  * **역할**: 모바일/타블렛 기기용 가상 터치 D-Pad 버튼 패널.

* **[`src/components/GameOverModal.tsx`](file:///c:/app/workspace/kimtetris/src/components/GameOverModal.tsx)**
  * **역할**: 게임 오버 후 점수 확인 및 닉네임 입력으로 Supabase/API 랭킹 등록 모달.

* **[`src/components/LeaderboardModal.tsx`](file:///c:/app/workspace/kimtetris/src/components/LeaderboardModal.tsx)**
  * **역할**: 온라인 Top 10 명예의 전당 모달.

* **[`src/components/ControlsModal.tsx`](file:///c:/app/workspace/kimtetris/src/components/ControlsModal.tsx)**
  * **역할**: 게임 조작법 가이드 모달.

* **[`src/components/PauseModal.tsx`](file:///c:/app/workspace/kimtetris/src/components/PauseModal.tsx)**
  * **역할**: 일시정지 상태 메뉴 모달.
