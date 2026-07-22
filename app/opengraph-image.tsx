import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "Impact500 — Corporate responsibility, made legible.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#050816",
        color: "white",
        backgroundImage: "radial-gradient(circle at 85% 20%, #4f7eff55, transparent 30%)",
      }}
    >
      <div style={{ color: "#6EE7F9", fontSize: 28, letterSpacing: 8 }}>IMPACT500</div>
      <div style={{ fontFamily: "serif", fontSize: 78, marginTop: 30, lineHeight: 1 }}>
        Corporate responsibility,
        <br />
        made legible.
      </div>
      <div style={{ fontSize: 25, color: "#A1A1AA", marginTop: 35 }}>
        Independent CSR intelligence
      </div>
    </div>,
    size,
  );
}
