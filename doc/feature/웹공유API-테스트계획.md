# Web Share API 테스트 계획서

> K-Pop Face Test 결과 이미지 공유 기능 테스트 계획

**작성일**: 2026-01-21  
**작성자**: Viper (QA Manager)  
**버전**: 1.0.0  
**관련 태스크**: T1.8

---

## 1. 테스트 개요

### 1.1 테스트 대상
- **기능**: 결과 이미지 저장/공유 (`fnSaveResultImage()`)
- **파일**: `static/js/app.js` (공유 함수), `static/js/imageGenerator.js` (이미지 생성)
- **URL**: https://moony01.com/kpopface/

### 1.2 테스트 목적
1. Web Share API의 파일 공유 기능이 모바일 브라우저에서 정상 동작하는지 검증
2. PC 환경에서 자동 다운로드 fallback이 동작하는지 확인
3. 소속사별/언어별 결과 이미지가 정상 생성되는지 검증

### 1.3 테스트 범위
- Canvas API 이미지 생성
- Web Share API 파일 공유 (모바일)
- 자동 다운로드 fallback (PC)
- 15개 언어 CTA 텍스트

---

## 2. 테스트 환경

### 2.1 모바일 테스트 환경

| 플랫폼 | 브라우저 | 버전 | Web Share 지원 | 파일 공유 지원 |
|--------|----------|------|----------------|----------------|
| **iOS** | Safari | 14+ | ✅ 지원 | ✅ 지원 |
| **iOS** | Chrome | 최신 | ⚠️ 부분 지원* | ⚠️ 불안정 |
| **Android** | Chrome | 89+ | ✅ 지원 | ✅ 지원 (128+) |
| **Android** | Samsung Internet | 14+ | ✅ 지원 | ✅ 지원 |
| **Android** | Firefox | 최신 | ❌ 미지원 | ❌ 미지원 |

> *iOS Chrome: 일부 버전에서 불안정한 동작 보고됨 (클릭 스팸 필요)

### 2.2 PC 테스트 환경

| 플랫폼 | 브라우저 | Web Share 지원 | 예상 동작 |
|--------|----------|----------------|-----------|
| **Windows** | Chrome 128+ | ✅ 지원 | 공유 다이얼로그 |
| **Windows** | Edge | ✅ 지원 | 공유 다이얼로그 |
| **Windows** | Firefox | ❌ 미지원 | 자동 다운로드 |
| **macOS** | Safari 12.1+ | ✅ 지원 | 공유 시트 |
| **macOS** | Chrome | ✅ 지원 | 공유 다이얼로그 |

### 2.3 필수 조건
- **HTTPS 연결**: Web Share API는 Secure Context(HTTPS)에서만 동작
- **사용자 제스처**: 버튼 클릭 등 사용자 상호작용 필수 (자동 실행 불가)
- **GitHub Pages**: 기본 HTTPS 지원 ✅

---

## 3. 테스트 시나리오

### 3.1 기본 플로우 테스트

#### TC-001: 결과 이미지 생성 및 공유 (모바일)
```
사전 조건: 모바일 기기에서 https://moony01.com/kpopface/ 접속

테스트 단계:
1. 성별 선택 (남/여)
2. 테스트용 이미지 업로드
3. AI 분석 결과 확인 (SM/JYP/YG/HYBE)
4. "결과 이미지 저장하기" 버튼 클릭
5. 공유 시트(Share Sheet) 표시 확인
6. 인스타그램 스토리 선택
7. 이미지 정상 첨부 확인

예상 결과:
- 공유 시트에 앱 목록 표시됨
- 1080x1920 PNG 이미지 생성됨
- 소속사별 테마 색상 적용됨
- 인스타그램에 이미지 정상 업로드됨
```

#### TC-002: 결과 이미지 다운로드 (PC)
```
사전 조건: PC Chrome에서 https://moony01.com/kpopface/ 접속

테스트 단계:
1. 테스트 실행 → 결과 확인
2. "결과 이미지 저장하기" 버튼 클릭
3. 파일 다운로드 확인

예상 결과:
- kpop-face-result-{agency}.png 파일 다운로드됨
- 이미지 크기: 1080x1920px
- 파일 크기: 500KB 이하
```

#### TC-003: Web Share API 미지원 브라우저 (Firefox)
```
사전 조건: Firefox Desktop에서 접속

테스트 단계:
1. 테스트 실행 → 결과 확인
2. "결과 이미지 저장하기" 버튼 클릭

예상 결과:
- navigator.canShare() 반환값: false 또는 undefined
- 자동 다운로드로 fallback
- 콘솔 에러 없음
```

### 3.2 소속사별 테스트

#### TC-004: SM 결과 이미지
```
테스트 데이터:
- agency: "sm"
- title: "SM얼굴상" (한국어) / "SM Face Type" (영어)
- 테마 색상: #0066FF → #00D4FF (파란 그라데이션)
- 이모지: 💙

확인 항목:
- [ ] 배경 그라데이션 정상
- [ ] 결과 제목 표시
- [ ] 해시태그 줄바꿈 정상
- [ ] CTA 버튼 텍스트
- [ ] URL 워터마크
```

#### TC-005 ~ TC-007: JYP/YG/HYBE 결과 이미지
- JYP: 초록 계열 (#00C853 → #69F0AE), 💚
- YG: 블랙 계열 (#212121 → #616161), 🖤
- HYBE: 보라-핑크 (#6B46C1 → #EC4899), 💜

### 3.3 다국어 테스트

#### TC-008: CTA 텍스트 언어별 확인
| 언어 | CTA 텍스트 | 테스트 URL |
|------|-----------|-----------|
| ko | 나도 테스트 하기! | /kpopface/ |
| en | Try the test! | /kpopface/en |
| ja | テストしてみる！ | /kpopface/ja |
| zh | 我也要测试！ | /kpopface/zh |
| de | Mach den Test! | /kpopface/de |
| es | ¡Haz el test! | /kpopface/es |
| fr | Fais le test ! | /kpopface/fr |
| id | Coba tesnya! | /kpopface/id |
| nl | Doe de test! | /kpopface/nl |
| pl | Zrób test! | /kpopface/pl |
| pt | Faça o teste! | /kpopface/pt |
| ru | Пройди тест! | /kpopface/ru |
| tr | Testi yap! | /kpopface/tr |
| uk | Пройди тест! | /kpopface/uk |
| vi | Làm bài test! | /kpopface/vi |

### 3.4 공유 대상 앱 테스트 (모바일)

#### TC-009: 인스타그램 스토리 공유
```
테스트 단계:
1. 결과 이미지 저장 버튼 클릭
2. 공유 시트에서 "Instagram Stories" 선택
3. 스토리 편집 화면에서 이미지 확인

확인 항목:
- [ ] 이미지 비율 정상 (9:16)
- [ ] 텍스트 가독성
- [ ] 배경 품질
```

#### TC-010: 카카오톡 공유
```
테스트 단계:
1. 결과 이미지 저장 버튼 클릭
2. 공유 시트에서 "카카오톡" 선택
3. 채팅방 선택 후 이미지 전송

확인 항목:
- [ ] 이미지 첨부 정상
- [ ] 미리보기 썸네일 표시
```

#### TC-011: 기타 앱 공유
- 메시지/문자
- 이메일
- 클립보드 복사
- 파일에 저장

---

## 4. 엣지 케이스 테스트

### 4.1 예외 상황

#### TC-012: 결과 없이 저장 버튼 클릭
```
테스트 단계:
1. 테스트 실행 전 저장 버튼 클릭 시도

예상 결과:
- 현재 구현: 버튼이 결과 영역 내부에 있어 접근 불가
- 예외 처리: "먼저 테스트를 완료해주세요!" alert
```

#### TC-013: 공유 취소
```
테스트 단계:
1. 저장 버튼 클릭 → 공유 시트 표시
2. 공유 취소 (뒤로가기 또는 X)

예상 결과:
- AbortError 발생 (정상)
- 버튼 상태 복구됨
- 콘솔에 에러 로그 (예상됨)
```

#### TC-014: 중복 클릭 방지
```
테스트 단계:
1. 저장 버튼 빠르게 연속 클릭

예상 결과:
- 첫 클릭만 처리됨
- 버튼 disabled 상태
- 중복 공유 시트 방지
```

#### TC-015: 대용량 이미지 처리
```
테스트 조건:
- 이미지 크기: 1080x1920px
- 예상 용량: 300~500KB

확인 항목:
- [ ] 생성 시간 3초 이내
- [ ] 메모리 누수 없음
- [ ] 공유 정상 동작
```

### 4.2 네트워크 상황

#### TC-016: 오프라인 상태
```
테스트 조건: 비행기 모드 활성화

예상 결과:
- Canvas 이미지 생성: ✅ 정상 (클라이언트 사이드)
- Web Share API: ✅ 로컬 앱 공유 가능
- 클라우드 공유: ❌ 앱 내에서 실패 처리
```

---

## 5. 브라우저 호환성 매트릭스

### 5.1 Web Share API 지원 현황 (2024-2025)

| 브라우저 | 텍스트/URL | 파일 공유 | 비고 |
|----------|-----------|----------|------|
| Chrome (Android) | ✅ 89+ | ✅ 128+ | 완전 지원 |
| Safari (iOS) | ✅ 12.2+ | ✅ 15+ | 완전 지원 |
| Samsung Internet | ✅ 14+ | ✅ 14+ | 완전 지원 |
| Chrome (Windows) | ✅ 89+ | ✅ 128+ | Win10+ |
| Edge | ✅ 81+ | ✅ 95+ | 완전 지원 |
| Safari (macOS) | ✅ 12.1+ | ✅ 14+ | 완전 지원 |
| Firefox (모든 플랫폼) | ❌ 미지원 | ❌ 미지원 | Fallback 필요 |
| Opera | ✅ 114+ | ✅ 114+ | 지원 |

### 5.2 지원율
- **전체**: ~92.58% (Can I Use 기준)
- **모바일**: ~95% (Android Chrome + iOS Safari)

---

## 6. 예상 이슈 및 대응 방안

### 6.1 알려진 이슈

| ID | 이슈 | 영향 | 대응 |
|----|------|------|------|
| ISS-001 | Firefox 미지원 | 낮음 | 자동 다운로드 fallback |
| ISS-002 | iOS Chrome 불안정 | 중간 | 재시도 안내 또는 Safari 권장 |
| ISS-003 | HTTP에서 동작 안함 | 높음 | GitHub Pages HTTPS 사용 |
| ISS-004 | 폰트 렌더링 지연 | 낮음 | `document.fonts.ready` 대기 |
| ISS-005 | 대용량 파일 거부 | 낮음 | PNG 품질 최적화 |
| ISS-006 | **버튼 클래스명 불일치** | **중간** | **수정 필요 (아래 상세)** |

### 6.2.1 🔴 발견된 버그: 버튼 클래스명 불일치

**[BUG-001] 버튼 상태 업데이트 불가**

| 항목 | 내용 |
|------|------|
| **심각도** | Medium |
| **영향** | 버튼 "생성중..." 텍스트 표시 안됨 |
| **원인** | 클래스명 불일치 |
| **담당** | Luna (프론트엔드) |

**상세 설명**:
- `app.js` Line 233: `.save-result-btn` 클래스를 찾음
- `index.html` Line 68: 실제 클래스는 `.save-image-btn`

```javascript
// app.js (Line 233) - 잘못된 선택자
var saveBtn = document.querySelector('.save-result-btn');

// index.html (Line 68) - 실제 클래스
<button type="button" id="save-image-btn" class="save-image-btn" ...>
```

**수정 방안**:
```javascript
// 옵션 1: ID로 선택 (권장)
var saveBtn = document.getElementById('save-image-btn');

// 옵션 2: 클래스명 통일
var saveBtn = document.querySelector('.save-image-btn');
```

**테스트 영향**:
- 버튼 disabled 상태 전환 동작 안함
- "생성중..." 텍스트 표시 안됨
- 중복 클릭 방지 기능 무력화 가능성

### 6.2 대응 코드 (현재 구현)

```javascript
// 현재 구현 (app.js L259-278)
if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
  // 모바일: Web Share API
  await navigator.share({
    files: [imageFile],
    title: 'K-POP Face Test Result',
    text: currentResultTitle
  });
} else {
  // PC/미지원: 자동 다운로드
  var downloadUrl = URL.createObjectURL(imageBlob);
  var downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadUrl);
}
```

### 6.3 향후 개선 제안

1. **iOS Chrome 대응**: 재시도 로직 또는 Safari 리다이렉트
2. **폰트 로딩 표시**: 이미지 생성 중 스피너 UI
3. **에러 메시지 다국어화**: 실패 시 언어별 안내
4. **파일 크기 최적화**: JPEG 옵션 제공 (용량 감소)

---

## 7. 테스트 체크리스트

### 7.1 배포 전 필수 테스트

#### 기능 테스트
- [ ] Canvas 이미지 생성 (SM/JYP/YG/HYBE 각 1회)
- [ ] Web Share API 공유 (iOS Safari)
- [ ] Web Share API 공유 (Android Chrome)
- [ ] PC 다운로드 (Windows Chrome)
- [ ] Fallback 다운로드 (Firefox)

#### 다국어 테스트
- [ ] 한국어 CTA 표시
- [ ] 영어 CTA 표시
- [ ] 일본어 CTA 표시 (특수문자 확인)
- [ ] 러시아어 CTA 표시 (키릴 문자 확인)

#### 예외 처리
- [ ] 공유 취소 시 에러 없음
- [ ] 중복 클릭 방지 동작
- [ ] 버튼 상태 복구

### 7.2 테스트 결과 기록 양식

```markdown
## 테스트 결과 기록

### 테스트 정보
- 테스터:
- 테스트 일시:
- 테스트 환경:

### 결과 요약
| TC ID | 테스트명 | 결과 | 비고 |
|-------|----------|------|------|
| TC-001 | 모바일 공유 | PASS/FAIL | |
| TC-002 | PC 다운로드 | PASS/FAIL | |
| ... | ... | ... | |

### 발견된 버그
1. [BUG-001] {설명}
2. ...

### 스크린샷
- (첨부)
```

---

## 8. 참고 자료

### 8.1 공식 문서
- [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [MDN navigator.share()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [MDN navigator.canShare()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare)
- [W3C Web Share Specification](https://www.w3.org/TR/web-share/)
- [W3C Editor's Draft](https://w3c.github.io/web-share/)

### 8.2 브라우저 지원 현황
- [Can I Use - Web Share](https://caniuse.com/web-share)
- [Chrome Platform Status](https://www.chromestatus.com/feature/4777349178458112)
- [WebKit Bug Tracker](https://bugs.webkit.org/show_bug.cgi?id=198606)

### 8.3 개발 가이드 및 예제
- [web.dev - Web Share](https://web.dev/articles/web-share)
- [LogRocket - Advanced Guide](https://blog.logrocket.com/advanced-guide-web-share-api-navigator-share/)
- [Ben Kaiser - Sharing Images Demo](https://benkaiser.github.io/web-share-images/)
- [MDN Demo](https://mdn.github.io/dom-examples/web-share/)

### 8.4 알려진 이슈 참고
- [iOS Safari - Share only works once (WebKit Bug 216913)](https://bugs.webkit.org/show_bug.cgi?id=216913)
- [Android Chrome - Share dialog fires twice](https://dev.to/nilportugues/how-to-fix-web-share-api-firing-twice-under-android-chrome-ji3)
- [Web Platform Tests](https://wpt.live/web-share/)

### 8.5 프로젝트 관련 문서
- [결과이미지-공유기능.md](./결과이미지-공유기능.md)
- [CLAUDE.md](../../CLAUDE.md)

---

## 9. 승인

| 역할 | 이름 | 일자 | 서명 |
|------|------|------|------|
| QA Manager | Viper | 2026-01-21 | ✅ 작성 완료 |
| 개발자 | Max | | (구현 확인 후) |
| CTO | Jeff Dean | | (배포 승인) |

---

**문서 끝**
