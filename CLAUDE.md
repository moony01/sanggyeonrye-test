# K-Pop Face Test 프로젝트

> AI 기반 K-POP 소속사 얼굴상 테스트 서비스

## 프로젝트 개요

- **URL**: https://moony01.com/kpopface/
- **기술 스택**: Jekyll (Ruby), Teachable Machine (TensorFlow.js), Vanilla JS/CSS
- **호스팅**: GitHub Pages
- **다국어**: 15개 언어 지원

## 프로젝트 구조

```
/kpopface
├── index.html              # 메인 페이지 (한국어)
├── /en, /ja, /zh, ...      # 다국어 페이지
├── /_layouts               # Jekyll 템플릿
├── /_includes              # 재사용 컴포넌트
├── /static
│   ├── /js
│   │   ├── app.js          # 메인 로직 (AI, 공유)
│   │   └── comment.js      # 댓글 기능
│   ├── /css                # 스타일시트
│   └── /img                # 이미지 에셋
├── /doc                    # 문서 (한국어 파일명!)
│   ├── /feature            # 기능 명세
│   └── /database           # DB/API 관련
├── /.claude/planning       # 프로젝트 관리 문서
│   ├── tasks.md            # 현재 태스크 목록
│   ├── tasks-completed.md  # 완료된 태스크 아카이브
│   └── prd.md              # 제품 요구사항 문서
└── _config.yml             # Jekyll 설정
```

## 핵심 파일

| 파일 | 역할 |
|------|------|
| `static/js/app.js` | AI 모델 로드, 예측, SNS 공유 |
| `_layouts/default.html` | 공통 레이아웃, SDK 로드 |
| `_config.yml` | 사이트 설정, SEO |

## 개발 환경

```bash
# 로컬 실행
bundle install
bundle exec jekyll serve

# 배포
git push origin main  # GitHub Pages 자동 배포
```

---

# 코딩 컨벤션

## 파일/폴더 네이밍

| 위치 | 규칙 | 예시 |
|------|------|------|
| `/doc/**` | **한국어** 파일명 사용 | `결과이미지-공유기능.md` |
| `/static/js` | camelCase | `imageGenerator.js` |
| `/static/css` | kebab-case | `main.css` |
| `/_includes` | snake_case | `vote_section_ko.html` |

## JavaScript

- ES5 호환 유지 (Jekyll 빌드 환경)
- 전역 함수명: `fn` 접두사 (예: `fnSendFB`, `fnSaveResultImage`)
- 주석: 한국어 허용

## CSS

- BEM 네이밍 권장
- Vanilla CSS 사용 (Tailwind/SCSS 미사용)

---

# Git 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| `main` | 개발 브랜치 |
| `gh-pages` | 배포 브랜치 (GitHub Pages) |

```bash
# 배포 플로우
git checkout gh-pages
git merge main
git push
```

---

# 프로젝트 관리 (Planning)

## 문서 위치

`.claude/planning/` 폴더에서 프로젝트 태스크를 관리합니다.

## 문서 용도

| 파일 | 용도 | 업데이트 시점 |
|------|------|--------------|
| `tasks.md` | 현재 진행 중인 태스크 목록 | 태스크 추가/상태 변경 시 |
| `tasks-completed.md` | 완료된 태스크 아카이브 | 태스크 완료 후 이동 |
| `prd.md` | 제품 요구사항 문서 | 기능 추가/변경 시 |

## 태스크 관리 규칙

### 태스크 ID 형식

```
T{Phase}.{Number} [{TYPE}] {제목}

예시:
T1.1 [FEAT] Canvas API 이미지 생성 로직 구현
T1.2 [BUG] 폰트 렌더링 오류 수정
T1.3 [UI] 저장 버튼 추가
```

### 태스크 타입

| 타입 | 설명 |
|------|------|
| `[FEAT]` | 새로운 기능 |
| `[BUG]` | 버그 수정 |
| `[UI]` | UI/UX 개선 |
| `[PERF]` | 성능 개선 |
| `[I18N]` | 다국어 관련 |
| `[QA]` | 테스트/검증 |
| `[ASSET]` | 이미지/리소스 |

### 우선순위

| 레벨 | 표시 | 설명 |
|------|------|------|
| Critical | 🔴 | 즉시 처리 필요 |
| High | 🟡 | 중요, 빠른 처리 |
| Normal | ⬜ | 일반 |
| Phase 2 | 🔮 | 향후 진행 |

### 태스크 완료 시

1. `tasks.md`에서 해당 태스크를 `✅ 완료` 섹션으로 이동
2. 커밋 해시, 완료일 기록
3. 주기적으로 `tasks-completed.md`로 아카이브
