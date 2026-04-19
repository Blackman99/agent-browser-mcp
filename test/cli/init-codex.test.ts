import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initCodex } from '../../src/cli/init-codex.js';
import {
  renderMarketplaceJson,
  renderMcpJson,
  renderPluginJson,
} from '../../src/cli/render-plugin.js';

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

describe('initCodex', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates plugin and marketplace files with npx launch config', async () => {
    const home = mkdtempSync(join(tmpdir(), 'agent-browser-mcp-codex-'));

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
    expect(mcp.mcpServers['agent-browser'].args).toEqual(['-y', 'agent-browser-mcp-codex']);
    expect(marketplace.plugins[0].name).toBe('agent-browser');
  });

  it('keeps render helpers in sync with the committed Codex templates', () => {
    expect(renderPluginJson()).toEqual(
      readJson(join(process.cwd(), 'codex/plugin/.codex-plugin/plugin.json')),
    );
    expect(renderMcpJson()).toEqual(readJson(join(process.cwd(), 'codex/plugin/.mcp.json')));
    expect(renderMarketplaceJson()).toEqual(
      readJson(join(process.cwd(), 'codex/plugin/marketplace.json')),
    );
  });

  it('prints next steps that tell the user to restart Codex or start a new session', async () => {
    const home = mkdtempSync(join(tmpdir(), 'agent-browser-mcp-codex-'));

    await initCodex({
      homeDir: home,
      hasAgentBrowser: async () => true,
    });

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(String(vi.mocked(console.log).mock.calls[0]?.[0])).toContain('Restart Codex');
    expect(String(vi.mocked(console.log).mock.calls[0]?.[0])).toContain('new session');
  });

  it('fails safely when an existing marketplace file has a malformed shape', async () => {
    const home = mkdtempSync(join(tmpdir(), 'agent-browser-mcp-codex-'));
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

    await expect(
      initCodex({
        homeDir: home,
        hasAgentBrowser: async () => true,
      }),
    ).rejects.toThrow(/unsupported marketplace shape/i);

    const marketplace = JSON.parse(readFileSync(marketplacePath, 'utf8'));

    expect(marketplace).not.toHaveProperty('plugins');
  });

  it('preserves unrelated marketplace entries when rerun', async () => {
    const home = mkdtempSync(join(tmpdir(), 'agent-browser-mcp-codex-'));
    const marketplacePath = join(home, '.agents/plugins/marketplace.json');

    mkdirSync(join(home, '.agents/plugins'), { recursive: true });
    writeFileSync(
      marketplacePath,
      JSON.stringify(
        {
          name: 'custom',
          plugins: [
            {
              name: 'other-plugin',
              source: {
                source: 'local',
                path: './plugins/other-plugin',
              },
              policy: {
                installation: 'INSTALLED_BY_DEFAULT',
                authentication: 'ON_USE',
              },
              category: 'Productivity',
            },
          ],
        },
        null,
        2,
      ),
    );

    await initCodex({
      homeDir: home,
      hasAgentBrowser: async () => true,
    });

    const marketplace = readJson(marketplacePath);

    expect(marketplace.plugins).toHaveLength(2);
    expect(marketplace.plugins.map((entry: { name: string }) => entry.name)).toEqual([
      'other-plugin',
      'agent-browser',
    ]);
  });

  it('fails safely when an existing marketplace file cannot be parsed', async () => {
    const home = mkdtempSync(join(tmpdir(), 'agent-browser-mcp-codex-'));
    const marketplacePath = join(home, '.agents/plugins/marketplace.json');

    mkdirSync(join(home, '.agents/plugins'), { recursive: true });
    writeFileSync(marketplacePath, '{not-json');

    await expect(
      initCodex({
        homeDir: home,
        hasAgentBrowser: async () => true,
      }),
    ).rejects.toThrow(/unable to read existing marketplace/i);

    expect(readFileSync(marketplacePath, 'utf8')).toBe('{not-json');
  });

  it('fails safely when an existing marketplace file has an unusable shape', async () => {
    const home = mkdtempSync(join(tmpdir(), 'agent-browser-mcp-codex-'));
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

    await expect(
      initCodex({
        homeDir: home,
        hasAgentBrowser: async () => true,
      }),
    ).rejects.toThrow(/unsupported marketplace shape/i);

    expect(readFileSync(marketplacePath, 'utf8')).toContain('"displayName": "Legacy"');
  });

  it('fails when agent-browser is absent', async () => {
    const home = mkdtempSync(join(tmpdir(), 'agent-browser-mcp-codex-'));

    await expect(
      initCodex({
        homeDir: home,
        hasAgentBrowser: async () => false,
      }),
    ).rejects.toThrow('agent-browser was not found on PATH');
  });
});
