import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NCET Buddy — NCET Preparation Platform",
    short_name: "NCET Buddy",
    description:
      "India's #1 NCET mock test and preparation platform for ITEP entrance exam.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#E11D48",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
