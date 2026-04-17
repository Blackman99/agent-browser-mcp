import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import vitestConfig from '../../vitest.config.ts';

describe('package metadata', () => {
  it('declares the CLI bin, scripts, dependencies, and engines', () => {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
    );

    expect(pkg.name).toBe('agent-browser-mcp');
    expect(pkg.bin).toEqual({
      'agent-browser-mcp': 'dist/cli/index.js',
    });
    expect(pkg.scripts.build).toBe('tsc -p tsconfig.json');
    expect(pkg.scripts.test).toBe('vitest run');
    expect(pkg.scripts.dev).toBe('tsx src/cli/index.ts serve');
    expect(pkg.scripts['test:watch']).toBe('vitest');
    expect(pkg.scripts.typecheck).toBe('tsc -p tsconfig.json --noEmit');
    expect(pkg.engines.node).toBe('>=20');
    expect(pkg.dependencies).toEqual({
      '@modelcontextprotocol/sdk': '^1.11.0',
      execa: '^9.5.2',
      zod: '^3.24.3',
    });
    expect(pkg.devDependencies).toEqual({
      '@types/node': '^22.15.3',
      tsx: '^4.19.3',
      typescript: '^5.8.3',
      vitest: '^3.1.1',
    });
  });

  it('matches the Task 1 TypeScript config', () => {
    const tsconfig = JSON.parse(
      readFileSync(join(process.cwd(), 'tsconfig.json'), 'utf8'),
    );

    expect(tsconfig).toEqual({
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        lib: ['ES2022'],
        strict: true,
        declaration: true,
        outDir: 'dist',
        rootDir: '.',
        esModuleInterop: true,
        skipLibCheck: true,
      },
      include: ['src/**/*.ts', 'test/**/*.ts', 'vitest.config.ts'],
    });
  });

  it('matches the Task 1 Vitest config', () => {
    expect(vitestConfig).toEqual({
      test: {
        environment: 'node',
        include: ['test/**/*.test.ts'],
        clearMocks: true,
      },
    });
  });
});
