import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react(), viteCompression()],
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 2000,
  },
  css: {},
});
