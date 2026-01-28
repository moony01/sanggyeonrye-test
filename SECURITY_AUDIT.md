# 보안 점검 보고서 (Security Audit Report)

**점검 일시**: 2026-01-05
**점검 대상**: KPOP FACE TEST (투표 및 댓글 시스템)
**점검자**: Gemini Agent (Security Mode)

---

## 1. 개요

본 문서는 `static/js/comment.js` 및 관련 DB 로직에 대한 보안 취약점 점검 결과와 조치 사항을 기술합니다.

## 2. 점검 결과 요약

| 항목                           |     상태      |  중요도  | 비고                                                        |
| :----------------------------- | :-----------: | :------: | :---------------------------------------------------------- |
| **XSS (교차 사이트 스크립팅)** | **조치 완료** |   High   | `face_type` 데이터 이스케이프 처리 적용                     |
| **SQL Injection**              |   **양호**    | Critical | Supabase RPC 및 ORM 사용으로 예방                           |
| **권한 관리 (Auth)**           | **확인 필요** |   High   | RLS 정책 적용 여부 확인 필요                                |
| **서비스 거부 (DoS/Abuse)**    |   **취약**    |   Low    | 클라이언트 측 속도 제한만 존재 (API 직접 호출 시 우회 가능) |
| **데이터 보호**                |   **보통**    |  Medium  | 게시글 비밀번호 평문 처리 (익명 게시판 특성상 수용 가능)    |

---

## 3. 상세 분석 및 조치 사항

### 3.1. XSS 취약점 조치

- **문제점**: 댓글 렌더링 시 `face_type` 값이 이스케이프 없이 HTML에 삽입되는 코드가 발견됨. 악의적인 사용자가 DB에 스크립트를 주입할 경우 실행될 위험 존재.
- **조치**: `comment.js` 내 `renderComments` 함수에서 `escapeHtml(faceType)`을 적용하여 태그 실행을 차단함.

### 3.2. DB 통신 보안 (Supabase)

- **현황**: `kft_comments`, `kft_vote_counts` 테이블을 사용하며 `increment_vote`, `update_comment`, `delete_comment` RPC 함수를 호출함.
- **분석**:
  - `increment_vote`: `agency_key` 파라미터를 받으나 내부 로직에서 하드코딩된 값('SM', 'JYP' 등)과 비교하므로 Injection 위험 없음.
  - **권장 사항 (RLS 설정)**:
    - `kft_comments`: `anon` 역할에 대해 `INSERT` 및 `SELECT` 권한만 부여해야 함. `UPDATE`, `DELETE`는 반드시 RPC를 통해서만 수행되도록 RLS로 막아야 함.
    - `kft_vote_counts`: `anon` 역할에 대해 `SELECT` 권한만 부여해야 함. `UPDATE`는 RPC를 통해서만 가능해야 함.

### 3.3. 어뷰징 방지 (Rate Limiting)

- **현황**: 투표 시 `localStorage`를 확인하여 중복 투표를 방지하고 있음.
- **한계**: 브라우저 스토리지를 비우거나 API를 직접 호출(Curl, Postman)하는 공격에는 취약함.
- **권장 사항**:
  - 중요도가 높지 않은 "재미용 투표"이므로 현재 수준 유지도 가능하나,
  - 추후 공격이 감지될 경우 **Supabase Edge Function**을 도입하여 IP 기반 Rate Limiting 또는 reCAPTCHA 도입을 고려해야 함.

### 3.4. 비밀번호 관리

- **현황**: 익명 댓글 수정/삭제를 위해 비밀번호를 입력받아 평문으로 전송/비교함.
- **평가**: 일반적인 회원가입 시스템이 아닌 일회성 익명 게시판이므로, 해시(Hash) 복잡도를 도입하는 것보다 현재의 단순 비교 방식이 UX 및 성능상 타협 가능한 수준임. 단, **HTTPS(SSL)** 통신이 필수적임 (현재 Supabase 기본 적용).

---

## 4. 결론

주요 스크립트 기반 공격(XSS)에 대한 방어 코드를 적용하였으며, SQL Injection 위험은 낮은 것으로 판단됨. 데이터베이스 레벨의 **Row Level Security (RLS)** 정책만 확실히 설정되어 있다면 실서비스 운영에 큰 보안 위협은 없음.
