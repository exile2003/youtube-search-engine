import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'
import viteSassDts from 'vite-plugin-sass-dts';

export default defineConfig({
  base: '',
  plugins: [
   react(),
   viteSassDts({
     enabledMode: ['development', 'production'],
   }),
   ],
  test: {
    environment: 'jsdom',
    globals: true,
  }
})
