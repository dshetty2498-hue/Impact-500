import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Impact Horizon",
    short_name: "Impact Horizon",
    description: "Independent corporate responsibility research.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1118",
    theme_color: "#0B1118",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
