# PWA Camera 진행사항 / 해야 할 일

이 문서는 `pwa-camera` 프로젝트에서 남은 작업과 진행 상태를 정리합니다.

## 진행 상태(요약)

- **완료**: Next.js(TypeScript, App Router) 프로젝트 스캐폴딩 및 `next build` 확인
- **진행 중**: MUI 테마/레이아웃 적용(빌드 이슈 수정 포함)
- **대기**: PWA 구성, 설치 버튼/UI 분기, 카메라 촬영 및 썸네일 표시, README 정리, GitHub public repo 생성, Vercel 배포, 최종 보고

## 작업 체크리스트

### 1) 프로젝트 스캐폴딩

- [x] `pwa-camera/`에 Next.js(TypeScript, App Router) 생성
- [x] 로컬 빌드(`npm run build`)로 기본 동작 확인

### 2) UI 테마(MUI) + 컴팩트 레이아웃

- [x] MUI 설치 및 Provider 구성(`ThemeProvider`, `CssBaseline`)
- [x] 메인 화면을 깔끔하고 컴팩트한 레이아웃으로 정리
- [x] **빌드가 깨지지 않도록** Provider를 Client Component로 분리(필요 시)

### 3) PWA 구현(설치 가능 + 오프라인 캐시 기본)

- [x] `app/manifest.ts`로 Web App Manifest 구성(이름, 색상, start_url, display 등)
- [x] 아이콘(192/512) 제공(바이너리 파일 없이 라우트에서 PNG 생성)
- [x] Service Worker 등록 및 캐시 설정(Serwist 기반, 오프라인 폴백 포함)
- [ ] HTTPS 환경(Vercel)에서 설치 가능 여부 확인

### 4) 설치(다운로드) 여부에 따른 버튼 노출/동작

- [x] 설치됨 감지\n+  - `matchMedia('(display-mode: standalone)')`\n+  - iOS: `navigator.standalone`\n+- [x] 설치 가능 상태 감지: `beforeinstallprompt`\n+- [x] **설치 가능**일 때만 “다운로드” 버튼 노출 및 설치 트리거\n+- [x] **이미 설치됨**이면 다운로드 버튼 숨김/비활성 처리(정책에 맞게)

### 5) 카메라 촬영(설치된 경우에만 활성화) + 썸네일 표시

- [x] 설치되어 있을 때만 “사진 촬영” 버튼 활성화
- [x] 촬영 방식\n+  - 기본: `getUserMedia` 기반 촬영\n+  - 폴백: `<input type=\"file\" accept=\"image/*\" capture>`\n+- [x] 촬영된 이미지를 썸네일로 하단 그리드에 누적 표시(Object URL 사용)
- [ ] 필요 시 썸네일 삭제/초기화(옵션)

### 6) 문서화(README)

- [ ] 로컬 실행 방법\n+  - `npm i`\n+  - `npm run dev`\n+- [ ] PWA 테스트 방법(설치, standalone 확인, iOS/Android 차이)\n+- [ ] 배포 방법(Vercel + GitHub 연동)

### 7) GitHub public repo 생성 및 push

- [ ] GitHub: `yeonpmdevelop/pwa-camera` **public** repo 생성
- [ ] `main` 브랜치로 push

### 8) Vercel 배포

- [ ] Vercel 새 프로젝트 생성
- [ ] GitHub 레포 연결(자동 배포)
- [ ] Production 배포 URL 확인

### 9) 완료 보고(요청 포맷)

- [ ] `kholidayz-browser/update-rule.md` 예시 포맷으로 보고\n+  - 작업 요약(변경 파일)\n+  - Git 커밋 & push(커밋 해시)\n+  - Vercel 배포 URL

