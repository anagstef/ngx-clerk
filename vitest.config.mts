import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [angular({ tsconfig: 'projects/ngx-clerk/tsconfig.spec.json' })],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['projects/ngx-clerk/src/**/*.spec.ts'],
    setupFiles: ['projects/ngx-clerk/src/test-setup.ts'],
  },
});
