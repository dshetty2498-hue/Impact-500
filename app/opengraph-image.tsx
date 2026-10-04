import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "Impact Horizon — Corporate responsibility research, made transparent.";
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
        background: "#0B1118",
        color: "#F1F0EB",
        borderTop: "16px solid #6FB6C4",
      }}
    >
      <div style={{ color: "#6FB6C4", fontSize: 28, letterSpacing: 7 }}>IMPACT HORIZON</div>
      <div style={{ fontFamily: "serif", fontSize: 78, marginTop: 30, lineHeight: 1 }}>
        Corporate responsibility research,
        <br />
        made transparent.
      </div>
      <div style={{ fontSize: 25, color: "#A1A1AA", marginTop: 35 }}>
        Independent research · Impact500 company index
      </div>
    </div>,
    size,
  );
}
