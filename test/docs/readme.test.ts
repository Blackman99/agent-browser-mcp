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
      'Expose local [`agent-browser`](https://github.com/vercel-labs/agent-browser) capabilities as MCP tools and bootstrap Codex integration quickly.',
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
    const quickStartSection = getSection('## Quick Start for Codex');

    expect(quickStartSection).toContain('npx agent-browser-mcp init-codex');
    expect(quickStartSection).toContain('Restart Codex or open a new session');
  });

  it('locks down the approved README wording and scope', () => {
    expect(readme).toContain(
      'Prerequisite: [`agent-browser`](https://github.com/vercel-labs/agent-browser) must already be installed locally.',
    );
    expect(readme).toContain(
      'This package currently exposes a focused subset of [`agent-browser`](https://github.com/vercel-labs/agent-browser) commands:',
    );
    expect(readme).toContain('- Navigation: `open`, `back`, `forward`, `reload`');
    expect(readme).toContain('- Interaction: `click`, `fill`, `type`');
    expect(readme).toContain(
      '- Read and page state: `get_title`, `get_text`, `get_html`, `snapshot`, `screenshot`, `wait`',
    );
    expect(readme).toContain('- Tabs: `tab_list`, `tab_new`, `tab_close`');
    expect(readme).toContain('- Runtime: `eval`');
    expect(readme).toContain('- Storage and network: `cookies_get`, `network_requests`');
    expect(readme).toContain(
      '- Sessions and raw passthrough: `session_current`, `session_list`, `session_close`, `run_raw_command`',
    );

    const manualSetupSection = getSection('## Manual Setup');
    expect(manualSetupSection).toContain(
      'If you want to wire the plugin in manually, the local Codex templates live under `codex/plugin/`.',
    );

    const limitationsSection = getSection('## Limitations');
    expect(limitationsSection).toContain(
      'This package currently exposes a subset of the upstream [`agent-browser`](https://github.com/vercel-labs/agent-browser) CLI, not the full surface.',
    );
    expect(limitationsSection).toContain('Some tool families are intentionally narrow right now.');
    expect(limitationsSection).toContain(
      'Broader coverage may be added over time, but the current surface should be treated as evolving.',
    );
    expect(limitationsSection).not.toMatch(/full parity|full-featured|complete coverage/i);

    const developmentSection = getSection('## Development');
    const developmentCommands = developmentSection.match(/`[^`]+`/g) ?? [];

    expect(developmentSection).toContain('For local verification:');
    expect(developmentCommands).toEqual(['`npm test`', '`npm run typecheck`']);
    expect(developmentSection.match(/^\s*-\s+/gm) ?? []).toHaveLength(2);
  });
});
