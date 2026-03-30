# pwa-camera

설치 상태에 따라 UI가 달라지는 **PWA 카메라 데모**입니다.  
핵심 목표는 "설치 전/설치 후 UX 분기 + 카메라 촬영 + 오프라인 기본 지원"입니다.

## 무엇을 하는 프로젝트인가

- **설치 가능 상태**(주로 Chrome/Edge): `beforeinstallprompt`를 받아 “다운로드(PWA)” 버튼 활성화
- **설치 완료 상태(standalone)**: “사진 촬영” 버튼 활성화
- **카메라 촬영**:
  - 기본: `getUserMedia` 프리뷰에서 캡처
  - 폴백: `<input type="file" accept="image/*" capture="environment">`
- **오프라인 대응**: Service Worker(Serwist) + `/~offline` 폴백 페이지
- **iOS 대응**: Safari 정책상 자동 설치 프롬프트가 없어, 공유 메뉴의 "홈 화면에 추가" 안내 모달 제공

## 데모/배포

- Production: [https://pwa-camera-topaz.vercel.app](https://pwa-camera-topaz.vercel.app)
- Repository: [https://github.com/yeonpm/pwa-camera](https://github.com/yeonpm/pwa-camera)

## 기술 스택

- Next.js 16 (App Router, TypeScript)
- MUI 7
- Serwist (`@serwist/next`) for Service Worker
- Vercel 배포

## 프로젝트 구조(핵심 파일)

- `src/app/page.tsx`
  - 설치 여부 감지
  - 설치 버튼 노출/동작 분기
  - 카메라 촬영/폴백/썸네일 렌더링
- `src/app/manifest.ts`
  - PWA Manifest 생성
- `src/app/sw.ts`
  - Serwist 서비스워커 엔트리
- `src/app/~offline/page.tsx`
  - 오프라인 폴백 문서
- `src/app/icon-192.png/route.tsx`, `src/app/icon-512.png/route.tsx`
  - 앱 아이콘 라우트

## 로컬 실행

```bash
npm i
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

> 참고: Serwist 설정 때문에 `dev/build`는 webpack 플래그를 사용합니다.  
> (`package.json`의 `next dev --webpack`, `next build --webpack`)

## PWA 설치/동작 테스트

### Android/데스크톱 Chrome

- 주소창 오른쪽의 “설치” 또는 페이지 내 “다운로드(PWA)” 버튼으로 설치
- 설치 후 앱을 실행(standalone)하면
  - 상단 Chip이 `Installed`
  - “사진 촬영” 버튼이 활성화

### iOS Safari

iOS는 `beforeinstallprompt`를 지원하지 않습니다.  
대신 “다운로드(PWA)” 버튼을 누르면 설치 안내 모달이 뜨며, Safari 공유 메뉴에서 **홈 화면에 추가**로 설치한 뒤 standalone 동작을 확인합니다.

## 오프라인 테스트

- Chrome DevTools → Network → Offline
- 새로고침 후 문서 네비게이션은 `/~offline` 폴백이 동작

## 배포(Vercel)

1. GitHub public repo로 push
2. Vercel에서 New Project → GitHub repo 연결
3. Production 배포 후 HTTPS에서 설치/아이콘/SW 등록/오프라인 폴백 확인
