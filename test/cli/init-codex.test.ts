import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initCodex } from '../../src/cli/init-codex.js';

describe('initCodex', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it('prints next steps that tell the user to restart Codex or start a new session', async () => {
    const home = mkdtempSync(join(tmpdir(), 'agent-browser-mcp-'));

    await initCodex({
      homeDir: home,
      hasAgentBrowser: async () => true,
    });

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(String(vi.mocked(console.log).mock.calls[0]?.[0])).toContain('Restart Codex');
    expect(String(vi.mocked(console.log).mock.calls[0]?.[0])).toContain('new session');
  });

  it('repairs malformed marketplace files without duplicating the plugin on rerun', async () => {
    const home = mkdtempSync(join(tmpdir(), 'agent-browser-mcp-'));
    const marketplacePath = join(home, '.agents/plugins/marketplace.json');

    mkdirSync(join(home, '.agents/plugins'), { recursive: true });
    writeFileSync(
      marketplacePath,
      JSON.stringify(
        {
          name: 'legacy',
          interface: {
            displayName: 'Legacy',
          },
        },
        null,
        2,
      ),
    );

    await initCodex({
      homeDir: home,
      hasAgentBrowser: async () => true,
    });

    await initCodex({
      homeDir: home,
      hasAgentBrowser: async () => true,
    });

    const marketplace = JSON.parse(readFileSync(marketplacePath, 'utf8'));

    expect(Array.isArray(marketplace.plugins)).toBe(true);
    expect(marketplace.plugins).toHaveLength(1);
    expect(marketplace.plugins[0].name).toBe('agent-browser');
  });
});
