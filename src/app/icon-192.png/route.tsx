import { ImageResponse } from "next/og";

export const runtime = "edge";

function Icon({ size }: { size: number }) {
  const pad = Math.round(size * 0.12);
  const r = Math.round(size * 0.22);

  return (
    <div
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(135deg, #0b0f19 0%, #111827 60%, #0f172a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: size - pad * 2,
          height: size - pad * 2,
          borderRadius: r,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.16)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: Math.round(size * 0.06),
        }}
      >
        <div
          style={{
            width: Math.round(size * 0.36),
            height: Math.round(size * 0.36),
            borderRadius: Math.round(size * 0.12),
            background: "rgba(255,255,255,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: Math.round(size * 0.16),
              height: Math.round(size * 0.16),
              borderRadius: Math.round(size * 0.08),
              background: "#111827",
            }}
          />
        </div>
        <div
          style={{
            fontSize: Math.round(size * 0.1),
            letterSpacing: Math.round(size * 0.004),
            color: "rgba(255,255,255,0.92)",
            fontWeight: 800,
            fontFamily:
              'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
          }}
        >
          CAM
        </div>
      </div>
    </div>
  );
}

export function GET() {
  return new ImageResponse(<Icon size={192} />, { width: 192, height: 192 });
}

