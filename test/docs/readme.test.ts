import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');
const getSection = (heading: string) => {
  const start = readme.indexOf(heading);
  if (start === -1) return '';

  const nextHeading = readme.indexOf('\n## ', start + heading.length);
  return readme.slice(start, nextHeading === -1 ? undefined : nextHeading);
};

describe('README', () => {
  it('uses the required title and description pair', () => {
    expect(readme).toContain('# agent-browser-mcp');
    expect(readme).toContain(
      'Expose local `agent-browser` capabilities as MCP tools and bootstrap Codex integration quickly.',
    );
  });

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

  it('locks down the approved README wording and scope', () => {
    expect(readme).toContain('Prerequisite: `agent-browser` must already be installed locally.');
    expect(readme).toContain('codex/plugin/');
    expect(readme).toContain(
      'This package currently exposes a focused subset of `agent-browser` commands:',
    );
    expect(readme).toContain('subset of the upstream `agent-browser` CLI, not the full surface.');
    expect(readme).not.toMatch(/full parity|full-featured|complete coverage/i);

    const developmentSection = getSection('## Development');
    const developmentCommands = developmentSection.match(/`[^`]+`/g) ?? [];

    expect(developmentCommands).toEqual(['`npm test`', '`npm run typecheck`']);
    expect(developmentSection.match(/^\s*-\s+/gm) ?? []).toHaveLength(2);
    expect(developmentSection).toContain('For local verification:');
  });
});
