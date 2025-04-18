import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const defaultConfig = {
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Parcels",
        short_name: "Parcels",
        description: "Track your parcels through your email with AI",
        theme_color: "#faa74f",
        display: "standalone",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};

export default defineConfig(({ command, mode }) => {
  if (command === "serve") {
    const isDev = mode === "development";

    return {
      ...defaultConfig,
      server: {
        host: "0.0.0.0",
        proxy: {
          "/api": {
            target: isDev ? "http://localhost:3000" : "/api",
          },
        },
      },
    };
  } else {
    return defaultConfig;
  }
});
