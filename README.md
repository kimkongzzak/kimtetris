# 📊 CYBER TETRIS (사이버 테트리스)

> **Vercel 배포 준비 완료!** 모바일 및 데스크톱 브라우저에서 완벽하게 동작하는 반응형 웹 테트리스 게임입니다.
> 
> 기본 네온 글로우 다크 테마뿐만 아니라 **실제 Microsoft Excel 화면으로 100% 위장되는 📊 엑셀 스킨**과 **Boss Key(단축키 B)** 위장 기능이 탑재되어 있습니다.

---

## ✨ 핵심 주요 기능 (Key Features)

### 1. 📊 100% 엑셀 위장 스킨 (Excel Camouflage Theme)
- **엑셀 그린 리본 바 & 수식 입력줄 (`fx`)**: 상단 헤더가 `Microsoft Excel - 2026_실적분석.xlsx` 제목과 수식창으로 전환됩니다.
- **열(A~J) / 행(1~20) 스프레드시트 그리드**: 메인 테트리스 캔버스가 실제 엑셀 시트 셀 그리드로 감싸집니다.
- **엑셀 셀 렌더링**: 테트리스 블록이 엑셀 셀 강조 색상 및 흰색 테두리로 표시되어 멀리서 보면 엑셀 작업 중인 것으로 완벽 위장됩니다.
- **하단 엑셀 시트 탭 (Sheet Tabs)**: 화면 최하단에 `Sheet1 (2026_실적분석)` 탭이 노출됩니다.

### 2. 🎚️ 블록 전용 전폭 투명도 조절 (0% ~ 100%)
- UI 패널과 엑셀 틀은 100% 선명하게 유지하면서, **내려오는 블록의 색상 투명도만 0% ~ 100%까지 미세 조절**할 수 있습니다.
- 모바일 전용 전폭(Full-Width) 슬라이더 행으로 1% 단위의 섬세한 터치 조절이 가능합니다.

### 3. 🕵️ 몰컴 보스키 (Boss Key: 단축키 `B`)
- 게임 도중 키보드 **`B`** 키나 **`몰컴(B)`** 버튼을 누르면 0.1초 만에 사운드가 소거되고 **`2026_하반기_사업계획서_및_실적분석_보고서.docx`** 위장 문서 화면으로 전환됩니다.

### 4. 📱 모바일 & 데스크톱 완벽 반응형 UI
- **데스크톱**: 키보드 핫키 지원, 좌우 패널(HOLD, NEXT, STATS) 배치.
- **모바일**: 스크롤 없는 100dvh 한 화면 핏 + 3컬럼 레이아웃 + 전용 터치 D-Pad 컨트롤러 및 햅틱(Vibration) 반응.

### 5. 🕹️ 공식 테트리스 알고리즘 (SRS & 7-Bag)
- **SRS (Super Rotation System)**: 벽밀기 및 4단계 회전 충돌 검사 완벽 적용.
- **7-Bag 무작위 출현**: 균등한 7종 테트리미노 생성 알고리즘.
- **고스트 블록 (Ghost Piece)**: 착지 예정 지점 가이드라인 제공.
- **Web Audio API 합성 음원**: 외부 파일 없이 브라우저 자체 오디오 신디사이저로 효과음 100% 재생.

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 사용 기술 |
| --- | --- |
| **Framework** | Vite, React 18, TypeScript |
| **Styling** | Vanilla CSS (CSS Variables, Flexbox, Media Queries) |
| **Graphics** | HTML5 Canvas 2D Context |
| **Icons** | Lucide React |
| **Audio** | Browser Native Web Audio API |
| **Effects** | Canvas Confetti |
| **Deployment** | Vercel (Static Site Deployment) |

---

## 🎮 키보드 및 터치 조작법 (Controls)

| 키 (Key) | 기능 (Action) |
| --- | --- |
| `←` / `→` | 블록 좌/우 이동 |
| `↑` / `X` | 시계 방향 회전 |
| `Z` / `Ctrl` | 반시계 방향 회전 |
| `↓` | 소프트 드롭 (천천히 내리기) |
| `Spacebar` | 하드 드롭 (즉시 착지) |
| `C` / `Shift` | 홀드 (블록 보관/교체) |
| `P` / `Esc` | 일시정지 / 재개 |
| **`B`** | **몰컴 보스키 (보고서 위장 화면 전환)** |

---

## 🚀 프로젝트 실행 및 빌드 (Getting Started)

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

### 4. 프로덕션 빌드 및 타입 검사
```bash
npm run build
```

---

## 🌐 Vercel 배포 안내

본 프로젝트는 Vercel 배포 설정이 완료되어 있습니다.
1. GitHub 저장소에 푸시 후 [Vercel Dashboard](https://vercel.com/dashboard) 연결
2. Framework Preset: **`Vite`** 자동 감지 후 **Deploy** 클릭
