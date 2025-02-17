import { defineConfig } from 'vite';
import { resolve } from 'path';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

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
  plugins: [
    eslint(),
    checker({
      typescript: true,
      // eslint: { lintCommand: 'eslint "**/*.{js,ts}"' },
      eslint: { lintCommand: 'eslint "{ts,js,api,types}**/*.{js,ts}"' },
    }),
  ],
});
