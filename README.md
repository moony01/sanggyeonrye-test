## 프로젝트 제목

케이팝 AI 얼굴상 테스트 : [moony01.com/kpopface/](https://moony01.com/kpopface/)

## 프로젝트 설명

대한민국 케이팝 3대 엔터사의 연예인들의 얼굴을 학습 한 AI 얼굴상 테스트

## 핵심 개발 내용

- 앱을 웹, 모바일에 모두 호환 할 수 있도록 반응형 웹으로 퍼블리싱한다.

- Github가 지원하고 있는 Jekyll을 학습한다. (jekyll 기반의 앱을 Github 저장소에 push 하면 Github Pages가 자동으로 웹사이트를 빌드하고 호스팅합니다.)

- Python의 Selenium Webdriver를 활용하여 웹에서 Search Crawling을 하여 AI에 학습 시킬 데이터를 수집한다.

- Machine Learning 모델인 Teachable Machine에 데이터를 학습 시키고 API를 통신하여 결과를 가져온다.

- SEO를 최적화한다.

- PWA를 구현한다.

- React Native Webview를 사용하여 Play Store에 앱을 출시한다.

- 도메인을 연결한다.

- Google ads를 활용하여 마케팅을 진행한다.

- Root Domain을 활용하여 Adsense 광고를 적용한다.

- Cloudflare DNS를 연결하여 보안 및 트레픽을 관리한다.

## 설치 방법

1. 앱은 Ruby기반이기에 앱을 실행하기 위해 우선 [루비를 설치](https://www.ruby-lang.org/ko/downloads/)해야합니다.

2. 다음은 저장소를 clone합니다.

3. 프로젝트를 실행하기 전에 Gemfile에 명시된 종속성들을 설치 하기위해 `bundle install` 명령어를 실행합니다.

4. 종속성 설치를 완료했으면 `bundle exec jekyll serve` 명령어를 실행합니다.

# Git 명령어

1. 브랜치 변경: `git checkout gh-pages`

2. 현재 브랜치에서 다른 브랜치의 최신 버전 merge: `git merge main`

3. 최신 버전 merge한 내역 저장소에 push: `git push`

4. `git commit -m "명령어"`