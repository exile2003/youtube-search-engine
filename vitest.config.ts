import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/tests/**'], // ← здесь путь к папке с тестами
     exclude: [
      'src/tests/ignore/**'    // ← Vitest не будет запускать тесты здесь
    ],
    environment: 'jsdom',
    globals: true, // желательно включить
  },
});
