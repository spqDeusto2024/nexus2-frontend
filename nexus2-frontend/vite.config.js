import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: './', // Asegura rutas relativas
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist', // Asegúrate de que la carpeta de salida es correcta
    rollupOptions: {
      input: './index.html', // Usa el archivo de entrada correcto
    },
  },
});