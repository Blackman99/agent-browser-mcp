import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function readText(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8');
}

describe('package metadata', () => {
  it('declares the CLI bin, scripts, dependencies, and engines', () => {
    const pkg = JSON.parse(readText('package.json'));

    expect(pkg.name).toBe('agent-browser-mcp-codex');
    expect(pkg.homepage).toBe('https://github.com/Blackman99/agent-browser-mcp');
    expect(pkg.bugs).toEqual({
      url: 'https://github.com/Blackman99/agent-browser-mcp/issues',
    });
    expect(pkg.repository).toEqual({
      type: 'git',
      url: 'git+https://github.com/Blackman99/agent-browser-mcp.git',
    });
    expect(pkg.bin).toEqual({
      'agent-browser-mcp-codex': 'dist/src/cli/index.js',
    });
    expect(pkg.scripts.build).toBe('tsc -p tsconfig.json');
    expect(pkg.scripts.test).toBe('vitest run');
    expect(pkg.scripts.dev).toBe('tsx src/cli/index.ts serve');
    expect(pkg.scripts.prepublishOnly).toBe('npm run release:check');
    expect(pkg.scripts['release:check']).toBe(
      'npm run build && npm run typecheck && npm test && npm pack --dry-run',
    );
    expect(pkg.scripts['test:watch']).toBe('vitest');
    expect(pkg.scripts.typecheck).toBe('tsc -p tsconfig.json --noEmit');
    expect(pkg.engines.node).toBe('>=20');
    expect(pkg.publishConfig).toEqual({
      access: 'public',
    });
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
    const tsconfig = JSON.parse(readText('tsconfig.json'));

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
    const vitestConfig = readText('vitest.config.ts');

    expect(vitestConfig).toContain("environment: 'node'");
    expect(vitestConfig).toContain("include: ['test/**/*.test.ts']");
    expect(vitestConfig).toContain('clearMocks: true');
  });

  it('matches the Task 1 gitignore entries', () => {
    const gitignore = readText('.gitignore')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    expect(gitignore).toEqual([
      'node_modules',
      'dist',
      '.DS_Store',
      'coverage',
      '*.log',
      'tmp',
      'docs/superpowers/plans/',
    ]);
  });
});
