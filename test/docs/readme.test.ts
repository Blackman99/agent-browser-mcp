import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');

describe('README', () => {
  it('uses the approved Codex-first section order', () => {
    const quickStartIndex = readme.indexOf('## Quick Start for Codex');
    const whatYouGetIndex = readme.indexOf('## What You Get');
    const manualSetupIndex = readme.indexOf('## Manual Setup');
    const limitationsIndex = readme.indexOf('## Limitations');
    const developmentIndex = readme.indexOf('## Development');

    expect(quickStartIndex).toBeGreaterThan(-1);
    expect(whatYouGetIndex).toBeGreaterThan(quickStartIndex);
    expect(manualSetupIndex).toBeGreaterThan(whatYouGetIndex);
    expect(limitationsIndex).toBeGreaterThan(manualSetupIndex);
    expect(developmentIndex).toBeGreaterThan(limitationsIndex);
  });

  it('includes the Codex bootstrap command and restart guidance', () => {
    expect(readme).toContain('npx agent-browser-mcp init-codex');
    expect(readme).toMatch(/Restart Codex|new session/);
  });

  it('describes the current subset without claiming full upstream coverage', () => {
    expect(readme).toContain('focused subset');
    expect(readme).not.toMatch(/full parity|full-featured|complete coverage/i);
  });
});
