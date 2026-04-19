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
    const upstreamIndex = readme.indexOf('## What agent-browser already provides');
    const wrapperIndex = readme.indexOf('## What this MCP wrapper currently exposes');
    const manualSetupIndex = readme.indexOf('## Manual Setup');
    const limitationsIndex = readme.indexOf('## Limitations');
    const developmentIndex = readme.indexOf('## Development');

    expect(quickStartIndex).toBeGreaterThan(-1);
    expect(upstreamIndex).toBeGreaterThan(quickStartIndex);
    expect(wrapperIndex).toBeGreaterThan(upstreamIndex);
    expect(manualSetupIndex).toBeGreaterThan(wrapperIndex);
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
    const upstreamSection = getSection('## What agent-browser already provides');
    expect(upstreamSection).toContain(
      '[`agent-browser`](https://github.com/vercel-labs/agent-browser) already provides a broad browser automation surface, including:',
    );
    expect(upstreamSection).toContain('- Navigation and interaction');
    expect(upstreamSection).toContain(
      '- Keyboard, mouse, upload, download, and scrolling controls',
    );
    expect(upstreamSection).toContain('- Page inspection and info retrieval');
    expect(upstreamSection).toContain(
      '- Tabs, sessions, storage, and network operations',
    );
    expect(upstreamSection).toContain('- Debugging, diffing, recording, and streaming');
    expect(upstreamSection).toContain('- Auth, chat, dashboard, and setup commands');

    const wrapperSection = getSection('## What this MCP wrapper currently exposes');
    expect(wrapperSection).toContain(
      'This package currently exposes a focused subset of [`agent-browser`](https://github.com/vercel-labs/agent-browser) commands:',
    );
    expect(wrapperSection).toContain('- Navigation: `open`, `back`, `forward`, `reload`');
    expect(wrapperSection).toContain('- Interaction: `click`, `fill`, `type`');
    expect(wrapperSection).toContain(
      '- Read and page state: `get_title`, `get_text`, `get_html`, `snapshot`, `screenshot`, `wait`',
    );
    expect(wrapperSection).toContain('- Tabs: `tab_list`, `tab_new`, `tab_close`');
    expect(wrapperSection).toContain('- Runtime: `eval`');
    expect(wrapperSection).toContain(
      '- Storage and network: `cookies_get`, `network_requests`',
    );
    expect(wrapperSection).toContain(
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
