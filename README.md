# pwa-camera

설치 여부에 따라 **다운로드(PWA 설치)** / **사진 촬영** UI가 달라지는 PWA 샘플입니다.

- **설치 가능**(Chrome/Edge 등, `beforeinstallprompt` 발생): “다운로드(PWA)” 버튼 활성화
- **설치됨(standalone)**: “사진 촬영” 버튼 활성화
- 촬영 방식
  - 기본: `getUserMedia`로 카메라 프리뷰 → 프레임 캡처
  - 폴백: `<input type="file" accept="image/*" capture="environment">`
- 결과: 촬영된 이미지를 썸네일 그리드에 누적 표시(Object URL)

## 로컬 실행

```bash
npm i
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

> 참고: Serwist(Service Worker) 설정 때문에 `dev/build`는 webpack 플래그를 사용합니다.\n> (`package.json`의 `next dev --webpack`, `next build --webpack`)

## PWA 설치/동작 테스트

### Android/데스크톱 Chrome

- 주소창 오른쪽의 “설치” 또는 페이지 내 “다운로드(PWA)” 버튼으로 설치
- 설치 후 앱을 실행(standalone)하면\n  - 상단 Chip이 `Installed`\n  - “사진 촬영” 버튼이 활성화됩니다.

### iOS Safari

iOS는 `beforeinstallprompt`가 동작하지 않으므로 “다운로드(PWA)” 버튼이 활성화되지 않을 수 있습니다.\n대신 Safari 공유 메뉴에서 **홈 화면에 추가**로 설치한 뒤 standalone에서 동작을 확인하세요.

## 오프라인 테스트

- Chrome DevTools → Network → Offline\n- 새로고침 후 문서 네비게이션은 `/~offline` 폴백이 동작합니다.

## 배포(Vercel)

1. GitHub에 public repo로 push\n2. Vercel에서 New Project → GitHub repo 연결\n3. Production 배포 후 HTTPS 환경에서\n   - 설치 가능(install prompt)\n   - 아이콘 표시\n   - 서비스워커 등록/오프라인 폴백\n   을 확인합니다.

## 주요 파일

- `src/app/page.tsx`: 설치/카메라/썸네일 UI\n- `src/app/manifest.ts`: Web App Manifest\n- `src/app/sw.ts`: Service Worker(Serwist)\n- `src/app/~offline/page.tsx`: 오프라인 폴백 페이지
