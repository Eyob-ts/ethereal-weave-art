import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    spa: {
      enabled: true,
    },
  },
  // Update this line from cloudflare: false to nitro: false
  nitro: false,

  vite: {
    plugins: [
      nitro({
        preset: "netlify",
      }),
    ],
  },
});
