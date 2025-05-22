import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

const getCache = ({ name, pattern }) => ({
  urlPattern: pattern,
  handler: "CacheFirst",
  options: {
    cacheName: name,
    expiration: {
      maxEntries: 500,
      maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
    },
    cacheableResponse: {
      statuses: [0, 200],
    },
  },
});

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      workbox: {
        offlineGoogleAnalytics: true,
        runtimeCaching: [
          getCache({
            name: "youtube-assets",
            pattern: ({ url }) => url.origin === "https://i.ytimg.com",
          }),
          // Optional: cache audio files, fonts, etc.
        ],
        // ✅ Exclude external scripts from caching
        navigateFallbackDenylist: [
          new RegExp("^https://www.googletagmanager.com/.*"),
        ],
      },
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: true,
    }),
  ],
  build: {
    outDir: "build",
  },
});
