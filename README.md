# Sanggyeonrye Test (상견례 얼굴상)

> **Korean in-law meeting face test** — AI face analysis to predict whether your face is "프리패스상" (welcomed) or "문전박대상" (rejected) at a traditional Korean 상견례 (in-law meeting).

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Jekyll](https://img.shields.io/badge/Jekyll-static-red?logo=jekyll)](https://jekyllrb.com/)
[![PWA](https://img.shields.io/badge/PWA-enabled-purple.svg)](https://moony01.com/sanggyeonrye-test/)

🌐 **Live Demo**: https://moony01.com/sanggyeonrye-test/

---

## Overview

A culturally-rooted face test web app for Korean users. **상견례 (sanggyeonrye)** is the formal first meeting between two families before a wedding in Korea, and a person's facial impression is jokingly said to determine their reception. This app uses **Google Teachable Machine** to classify uploaded faces into traditional Korean impression categories — playful entertainment grounded in real cultural context.

A sister app to [kpopface](https://github.com/moony01/kpopface), sharing the same Jekyll-based architecture.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Generator** | Jekyll |
| **AI / ML** | Google Teachable Machine (cloud API) |
| **Hosting** | GitHub Pages |
| **Monetization** | Google AdSense |

## Local Development

```bash
git clone https://github.com/moony01/sanggyeonrye-test.git
cd sanggyeonrye-test

bundle install
bundle exec jekyll serve
```

Open http://localhost:4000/

## Privacy

Photos are sent to Google's Teachable Machine API for face analysis. Photos are not stored on our own servers. See [Google's Privacy Policy](https://policies.google.com/privacy) for details on Google's processing.

## License

[MIT License](LICENSE) © 2024–2026 [moony01](https://github.com/moony01)

## Contact

- 👤 [@moony01](https://github.com/moony01)
- 💖 [github.com/sponsors/moony01](https://github.com/sponsors/moony01)
