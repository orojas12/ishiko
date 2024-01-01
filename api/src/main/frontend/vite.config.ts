import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        signup: resolve(__dirname, "src/pages/signup/index.html"),
        signin: resolve(__dirname, "src/pages/signin/index.html")
      },
    },
  },
  plugins: [react()],
});
