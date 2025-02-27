import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/customer": {
        target: "http://localhost:8080", // Địa chỉ API server của bạn
        changeOrigin: true,
        secure: false, // Nếu bạn đang dùng HTTP mà không phải HTTPS
      },
    },
  },
});
