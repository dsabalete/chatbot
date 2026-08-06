import { defineConfig, Plugin } from 'vitest/config';
import { readFileSync } from 'fs';

function textLoader(): Plugin {
  return {
    name: 'text-loader',
    transform(code, id) {
      if (id.endsWith('.yaml') || id.endsWith('.yml') || id.endsWith('.md')) {
        const content = JSON.stringify(readFileSync(id, 'utf-8'));
        return {
          code: `export default ${content};`,
          map: null,
        };
      }
    },
  };
}

export default defineConfig({
  plugins: [textLoader()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      API_KEY: 'test-api-key',
    },
  },
});
