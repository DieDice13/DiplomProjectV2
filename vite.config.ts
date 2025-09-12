/// <reference types="vitest" />
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  test: {
    globals: true, // позволяет использовать expect без импорта
    environment: 'jsdom', // эмуляция браузера для React
    setupFiles: './src/setupTests.ts', // общий конфиг (например, jest-dom)
  },
});
