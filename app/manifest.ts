import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Impact500",
    short_name: "Impact500",
    description: "Independent corporate responsibility intelligence.",
    start_url: "/",
    display: "standalone",
    background_color: "#07111F",
    theme_color: "#07111F",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
