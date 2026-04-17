import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { initCodex } from '../../src/cli/init-codex.js';

describe('initCodex', () => {
  it('creates plugin and marketplace files with npx launch config', async () => {
    const home = mkdtempSync(join(tmpdir(), 'agent-browser-mcp-'));

    await initCodex({
      homeDir: home,
      hasAgentBrowser: async () => true,
    });

    const mcp = JSON.parse(
      readFileSync(join(home, 'plugins/agent-browser/.mcp.json'), 'utf8'),
    );
    const marketplace = JSON.parse(
      readFileSync(join(home, '.agents/plugins/marketplace.json'), 'utf8'),
    );

    expect(mcp.mcpServers['agent-browser'].command).toBe('npx');
    expect(mcp.mcpServers['agent-browser'].args).toEqual(['-y', 'agent-browser-mcp']);
    expect(marketplace.plugins[0].name).toBe('agent-browser');
  });
});
