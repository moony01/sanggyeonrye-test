# 보안 모드 (Security Mode) 가이드라인

## 1. 보안 모드 개념

- 보안 모드는 Fortify, AppScan, Nessus, 오픈소스 스캐너 등을 돌리기 **이전 단계에서** AI 에이전트가 수행하는 **선제적 보안 점검 모드**이다.
- 코드/설정/인프라 구성을 분석하여, 잠재적인 보안 취약점을 **정적 분석 수준에서 추정**하고, 개선 방향을 제안한다.
- 모든 진단 결과는 “의심/추정”으로 간주해야 하며, **최종 판단은 반드시 별도의 보안 스캐너 및 보안 담당자 리뷰로 보완**해야 한다.

---

## 2. 보안 분석 범위

보안 모드에서는 다음과 같은 자산을 대상으로 점검을 수행한다.

- **애플리케이션 코드**
  - Java / Spring / JSP / Servlet
  - JavaScript / Vue / Nuxt / Node.js
  - 기타 백엔드/프론트엔드 코드

- **설정 파일**
  - `application.yml`, `application.properties`
  - `web.xml`, `server.xml`, `nginx.conf`, `httpd.conf`
  - CI/CD 스크립트, Dockerfile 등

- **인프라/보안 관련 설정**
  - TLS/SSL 설정, Cipher Suite, 프로토콜 버전
  - 헤더 설정(CSP, HSTS, X-Frame-Options, X-Content-Type-Options 등)
  - 인증/인가 구조, 세션 정책 등

---

## 3. 주요 점검 항목 (카테고리 기준)

보안 모드에서는 아래 카테고리 관점에서 취약점 후보를 탐지한다.

1. **입력 검증 & 출력 인코딩**
   - XSS (Cross-Site Scripting)
   - SQL Injection / NoSQL Injection
   - 경로 조작(Path Traversal)
   - 파일 업로드/다운로드 경로 검증 누락
   - HTML/JS 출력 시 인코딩/이스케이프 누락

2. **인증 & 세션 관리**
   - 세션 타임아웃 부적절 또는 누락
   - 세션 고정, 세션 ID 노출
   - 로그인/인증 로직에서의 취약한 처리(예: HTTP로 비밀번호 전송)

3. **접근제어 & 권한관리**
   - URL/메서드 단위 접근 제어 누락
   - 관리자/일반 사용자 구분 없이 액션 수행 가능
   - DB 레벨 접근 통제(Access Control) 부재

4. **구성 & 플랫폼 보안**
   - Tomcat 기본 페이지/예제 삭제 누락
   - 디버그/테스트용 엔드포인트 노출
   - 불필요한 HTTP 메서드 허용 (TRACE, PUT, DELETE 등)

5. **웹 보안 헤더 & CSP**
   - CSP 정책 미설정 또는 `unsafe-inline`, `unsafe-eval` 과도 사용
   - X-Frame-Options 미설정 (Clickjacking 위험)
   - X-Content-Type-Options, Referrer-Policy 미설정

6. **암호화 & 민감정보 보호**
   - 비밀번호/주민번호 등 민감정보 평문 저장 및 평문 로그 출력
   - 취약한 난수(Insecure Randomness) 사용
   - 암호키/DB 접속정보 하드코딩

7. **로깅 & 정보노출**
   - `console.log`, `console.error`, 서버 로그 등에 내부 시스템 정보, 스택트레이스, 민감 데이터 노출
   - 에러 페이지에 내부 경로/쿼
