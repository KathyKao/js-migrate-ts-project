import { defineConfig } from 'vite';
import { resolve } from 'path';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  root: 'src',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
      output: {
        dir: resolve(__dirname, 'dist'),
      },
    },
  },
  plugins: [eslint()],
});
