import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      // "/customer": {
      //   target: "http://localhost:8080", // Địa chỉ API server của bạn
      //   changeOrigin: true,
      //   secure: false, // Nếu bạn đang dùng HTTP mà không phải HTTPS
      // },
    },
  },
  resolve: {
    alias: {
      "react-calendar-timeline/lib/Timeline.css": path.resolve(
        __dirname,
        "node_modules/react-calendar-timeline/lib/Timeline.css"
      ),
    },
  },
});
