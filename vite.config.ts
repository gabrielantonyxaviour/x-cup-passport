import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Expose NEXT_PUBLIC_* (shared vault naming) alongside VITE_* to the client.
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
});
