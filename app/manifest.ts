import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tattoin Studio",
    short_name: "Tattoin",
    description: "Custom tattoo studio in Bali.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a09",
    theme_color: "#0b0a09",
  };
}
