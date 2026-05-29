import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Campero Overland",
    short_name: "Campero",
    description:
      "Mobiliario portátil de camperización para SUV overland. Diseñado en Pucón, Chile.",
    start_url: "/es-CL",
    display: "standalone",
    background_color: "#FAF7F0",
    theme_color: "#04342C",
    lang: "es-CL",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
