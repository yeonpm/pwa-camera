"use client";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from "@mui/material";
import type { ChangeEventHandler } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function Home() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const isIOS = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent ?? "";
    const isAppleMobile = /iPad|iPhone|iPod/.test(ua);
    const isIPadOS13Plus =
      navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    return isAppleMobile || isIPadOS13Plus;
  }, []);

  const canInstall = useMemo(
    () => !isInstalled && deferredPrompt !== null,
    [deferredPrompt, isInstalled]
  );

  const [iosInstallOpen, setIosInstallOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const computeInstalled = () => {
      const standaloneViaMedia =
        typeof window !== "undefined" &&
        window.matchMedia?.("(display-mode: standalone)")?.matches;
      const standaloneViaIOS =
        typeof navigator !== "undefined" &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Boolean((navigator as any).standalone);
      setIsInstalled(Boolean(standaloneViaMedia || standaloneViaIOS));
    };

    computeInstalled();
    window.addEventListener("resize", computeInstalled);
    return () => window.removeEventListener("resize", computeInstalled);
  }, []);

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  useEffect(() => {
    return () => {
      for (const url of thumbs) URL.revokeObjectURL(url);
    };
  }, [thumbs]);

  const stopStream = () => {
    const stream = streamRef.current;
    if (!stream) return;
    for (const track of stream.getTracks()) track.stop();
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const openCamera = async () => {
    setCameraError(null);
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraError(
        "카메라 접근을 사용할 수 없어서 파일 선택(폴백)으로 전환합니다."
      );
      stopStream();
    }
  };

  const closeCamera = () => {
    setCameraOpen(false);
    stopStream();
  };

  const captureFrame = async () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92)
    );
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    setThumbs((prev) => [url, ...prev]);
    closeCamera();
  };

  const installPwa = async () => {
    if (isIOS) {
      setIosInstallOpen(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const onPickFile = () => fileInputRef.current?.click();
  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setThumbs((prev) => [url, ...prev]);
    e.target.value = "";
    closeCamera();
  };

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Stack spacing={2.5}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5" fontWeight={800}>
                PWA Camera
              </Typography>
              <Chip
                size="small"
                label={isInstalled ? "Installed" : "Not installed"}
                color={isInstalled ? "success" : "default"}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              설치 여부에 따라 다운로드/촬영 UI가 달라지는 PWA 샘플입니다.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.25}>
            <Button
              startIcon={<DownloadRoundedIcon />}
              onClick={installPwa}
              disabled={isInstalled || (!canInstall && !isIOS)}
            >
              다운로드 (PWA)
            </Button>
            <Button
              startIcon={<PhotoCameraRoundedIcon />}
              color="primary"
              disabled={!isInstalled}
              onClick={openCamera}
            >
              사진 촬영
            </Button>
          </Stack>

          <Stack spacing={1.25}>
            {!isInstalled && (
              <Alert severity="info" variant="outlined">
                - **다운로드(PWA)** 버튼은 설치 가능한 경우에만 활성화됩니다.
                <br />- 설치 후(standalone)에서만 **사진 촬영**이 활성화됩니다.
                {isIOS && (
                  <>
                    <br />- iOS Safari는 설치 프롬프트가 없어서 “공유” → “홈 화면에
                    추가”로 설치합니다.
                  </>
                )}
              </Alert>
            )}

            <Divider />

            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={800}>
                촬영된 이미지
              </Typography>
              {thumbs.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  아직 촬영된 이미지가 없습니다.
                </Typography>
              ) : (
                <ImageList cols={3} gap={8} sx={{ m: 0 }}>
                  {thumbs.map((src) => (
                    <ImageListItem key={src}>
                      <Box
                        component="img"
                        src={src}
                        alt="captured"
                        sx={{
                          width: "100%",
                          height: 96,
                          objectFit: "cover",
                          borderRadius: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <Dialog open={cameraOpen} onClose={closeCamera} fullWidth maxWidth="sm">
        <DialogTitle>사진 촬영</DialogTitle>
        <DialogContent>
          <Stack spacing={1.25}>
            {cameraError ? (
              <Alert severity="warning" variant="outlined">
                {cameraError}
              </Alert>
            ) : (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                }}
              >
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  style={{ width: "100%", height: 360, objectFit: "cover" }}
                />
              </Box>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={closeCamera}>
            닫기
          </Button>
          {cameraError ? (
            <Button onClick={onPickFile}>파일에서 선택</Button>
          ) : (
            <Button onClick={captureFrame}>촬영</Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={iosInstallOpen}
        onClose={() => setIosInstallOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>iOS에서 설치하기</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              iOS Safari는 자동 설치 팝업이 없어서 아래 순서로 설치합니다.
            </Typography>
            <Stack spacing={0.75}>
              <Typography variant="body2">
                1) Safari 하단(또는 상단)의 <b>공유</b> 버튼 탭
              </Typography>
              <Typography variant="body2">
                2) <b>홈 화면에 추가</b> 선택
              </Typography>
              <Typography variant="body2">
                3) 추가 후 홈 화면의 앱 아이콘으로 실행(standalone)
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIosInstallOpen(false)}>확인</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
