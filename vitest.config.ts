import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@error': path.resolve(import.meta.dirname, './src/error/index.ts'),
            '@modules': path.resolve(import.meta.dirname, './src/modules/index.ts')
        }
    },
    test: {
        environment: 'node',
        include: ['src/**/__tests__/**/*.test.ts']
    }
});
