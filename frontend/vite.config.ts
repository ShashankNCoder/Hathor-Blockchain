import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true, // Required to expose to network (for ngrok)
    port: 5000,
    cors: true,
    allowedHosts: ['.ngrok-free.app'] // Wildcard match for any ngrok subdomain
    // Alternatively, allow a specific domain:
    // allowedHosts: ['a9aa-223-237-165-105.ngrok-free.app']
  }
});
