import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('package metadata', () => {
  it('declares the CLI bin and required scripts', () => {
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
    expect(pkg.engines.node).toBe('>=20');
  });
});
