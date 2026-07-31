# 📊 KimTetris (반응형 사이버 테트리스 웹 게임)

> **Vercel & Supabase 연동 완료!** 모바일 및 데스크톱 브라우저에서 완벽하게 동작하는 반응형 웹 테트리스 게임입니다.  
> 세련된 **네온 사이버펑크 디자인**과 **100% 엑셀 위장 스킨**, **몰컴 보스키(단축키 B)**, **Web Audio API 오디오 합성 엔진**, **Supabase 클라우드 DB 연동 글로벌 명예의 전당**이 통합되어 있습니다.

---

## 🌟 개요 (Overview)

KimTetris는 모던 프론트엔드 기술(React 18, TypeScript, Vite)과 테트리스 가이드라인(Tetris Guideline) 표준 룰을 기반으로 개발된 반응형 웹 게임입니다.

- 📖 **프로젝트 상세 명세서 문서**: [`PROJECT_SPEC.md`](file:///c:/app/workspace/kimtetris/PROJECT_SPEC.md)에서 전체 파일별 상세 역할과 아키텍처를 확인하실 수 있습니다.

---

## ✨ 주요 특징 및 핵심 기능 (Key Features)

### 1. 📊 100% 엑셀 위장 스킨 & Canvas 2D 정밀 렌더링
- **엑셀 스킨 (Excel Camouflage Theme)**: 상단 `Microsoft Excel - 2026_실적분석.xlsx` 제목 및 `fx` 수식 입력줄과 하단 `Sheet1` 시트 탭이 노출됩니다.
- **Canvas 2D 통합 알파벳/행번호**: 테트리스 보드 캔버스 내부에서 A~J 열 헤더와 1~20 행번호가 비뚤어짐 없이 정밀 렌더링되어 멀리서 보면 엑셀 작업 중인 것으로 완벽 위장됩니다.

### 2. 🕵️ 몰컴 보스키 (Boss Key: 단축키 `B`)
- 게임 도중 키보드 **`B`** 키를 누르면 0.1초 만에 음소거와 함께 **`2026_하반기_사업계획서_및_실적분석_보고서.docx`** 보고서 문서 화면으로 즉시 전환됩니다.

### 3. 🏆 Supabase DB 연동 글로벌 명예의 전당
- **Supabase Cloud DB (`tetris_scores` 테이블)**: 사용자들의 닉네임과 점수, 달성 시각(`YYYY-MM-DD HH:mm`)이 클라우드 DB에 안전하게 보관됩니다.
- **In-Memory Fallback 지원**: Vercel Serverless Function API (`/api/highscore`)를 통해 DB 및 서버 메모리 양방향 안정적인 동기화를 제공합니다.
- **👑 1위 우승자 연출**: Top 1 달성 시 황금빛 그라데이션 글로우 텍스트와 바운싱 왕관(`👑`), Confetti 폭죽 효과가 펼쳐집니다.

### 4. 🕹️ 테트리스 표준 가이드라인 룰 준수
- **SRS (Super Rotation System) 벽차기**: 블록 회전 시 벽이나 타 블록과 겹칠 때 자연스럽게 위치를 밀어주는 표준 알고리즘.
- **7-Bag 공평한 난수 생성기**: 7가지 블록이 한 세트로 고르게 출현.
- **Hold & Next 뷰 (3개)** / **고스트 피스 (Ghost Piece)** / **락 디레이 (Lock Delay)** 완벽 탑재.

### 5. 🎵 Pure Web Audio API 사운드 엔진
- 외부 오디오 파일 없이 웹 브라우저의 `AudioContext` 오실레이터로 사운드 효과음과 8-bit 테트리스 BGM을 실시간 합성합니다.

### 6. 📱 모바일 반응형 & 가상 터치 D-Pad
- 터치 기기 사용자를 위한 화면 하단 가상 D-Pad 컨트롤러 패널 제공.

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 사용 기술 | 비고 |
| :--- | :--- | :--- |
| **Language** | TypeScript (v5.7.2) | 게임 엔진 및 백엔드 타입 안정성 확보 |
| **Frontend** | React (v18.3.1), Vite (v6.0.5) | 컴포넌트 개발 및 빠른 HMR 모듈 번들링 |
| **Database** | Supabase (PostgreSQL) | `tetris_scores` 테이블 점수 persistence 보장 |
| **Serverless API**| Vercel Serverless Functions (`@vercel/node`) | `/api/highscore` 최고점수 REST API |
| **Styling & Canvas**| Vanilla CSS3, HTML5 Canvas 2D | Cyberpunk Neon & 엑셀 셀 정밀 렌더링 |
| **Audio & Effects**| Web Audio API, Canvas Confetti, Lucide | 사운드 합성, 폭죽 연출, UI 아이콘 |

---

## 📂 프로젝트 구조 (Directory Structure)

구조와 파일별 상세 명세는 [PROJECT_SPEC.md](file:///c:/app/workspace/kimtetris/PROJECT_SPEC.md)를 참고하세요.

```
kimtetris/
├── 📄 PROJECT_SPEC.md        # 📖 프로젝트 상세 구조 및 파일역할 명세서
├── 📄 index.html             # HTML 메인 엔트리
├── 📄 package.json           # 의존성 패키지 및 실행 스크립트
├── 📄 tsconfig.json          # TypeScript 설정
├── 📄 vite.config.ts         # Vite 빌드 설정
├── 📄 vercel.json            # Vercel 서벌리스 설정
│
├── 📁 api/                   # Serverless Backend API
│   └── 📄 highscore.ts       # Supabase & In-Memory 리더보드 REST API
│
└── 📁 src/                   # Frontend React Source
    ├── 📄 main.tsx           # React 루트 진입점
    ├── 📄 App.tsx            # 메인 앱 레이아웃 & 모달/API 통합 관리
    ├── 📄 index.css          # 네온 스타일 & 엑셀 스킨 전역 CSS
    ├── 📁 lib/
    │   └── 📄 supabase.ts    # Supabase DB 클라이언트 & 쿼리 유틸
    ├── 📁 hooks/
    │   └── 📄 useTetris.ts   # 핵심 게임 루프 엔진 커스텀 훅
    ├── 📁 utils/
    │   ├── 📄 tetris.ts      # SRS 벽차기, 충돌검사, 점수 계산 유틸
    │   └── 📄 audio.ts       # Web Audio API 사운드 합성 엔진
    ├── 📁 types/
    │   └── 📄 tetris.ts      # 데이터 타입 정의 모듈
    └── 📁 components/        # UI 모듈 (TetrisBoard, ScoreBoard, TouchControls, Modals)
```

---

## 🎮 키보드 및 터치 조작법 (Controls)

| 키 (Key) | 기능 (Action) |
| :--- | :--- |
| `←` / `→` | 블록 좌 / 우 이동 |
| `↑` / `X` | 시계 방향 회전 (SRS 적용) |
| `Z` / `Ctrl` | 반시계 방향 회전 |
| `↓` | 소프트 드롭 (천천히 내리기) |
| `Spacebar` | 하드 드롭 (즉시 낙하 및 고정) |
| `C` / `Shift` | 홀드 (블록 보관 / 교체) |
| **`P` / `Esc`** | **일시정지 / 메뉴 열기** |
| **`B`** | **몰컴 보스키 (보고서 위장 화면 즉시 전환)** |

---

## 🚀 로컬 실행 및 빌드 방법 (Getting Started)

### 1. Repository 클론
```bash
git clone https://github.com/kimkongzzak/kimtetris.git
cd kimtetris
```

### 2. 의존성 패키지 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 접속 후 즉시 게임을 실행할 수 있습니다.

### 4. 타입 검사 및 프로덕션 빌드
```bash
npm run typecheck
npm run build
```

---

## 🌐 Vercel & Supabase 배포 안내 (Deployment)

1. GitHub 저장소를 Vercel 계정에 연결
2. Framework Preset으로 **Vite** 선택
3. Vercel 환경 변수(Environment Variables) 설정:
   - `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase Anon API Key
4. **Deploy** 클릭 시 웹 서비스 및 `/api/highscore` 서버리스 API가 배포됩니다.
