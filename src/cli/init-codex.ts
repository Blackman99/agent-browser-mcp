import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execa } from 'execa';
import {
  renderMarketplaceJson,
  renderMcpJson,
  renderPluginJson,
} from './render-plugin.js';

type InitCodexOptions = {
  homeDir?: string;
  hasAgentBrowser?: () => Promise<boolean>;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getPluginName(entry: unknown): string | undefined {
  if (!isObject(entry)) {
    return undefined;
  }

  return typeof entry.name === 'string' ? entry.name : undefined;
}

function buildMarketplaceJson(existing: unknown) {
  const template = renderMarketplaceJson();

  if (!isObject(existing)) {
    return template;
  }

  const plugins = Array.isArray(existing.plugins)
    ? existing.plugins.filter((entry) => getPluginName(entry) !== 'agent-browser')
    : [];

  return {
    ...template,
    ...existing,
    plugins: [...plugins, template.plugins[0]],
  };
}

export async function initCodex(options: InitCodexOptions = {}) {
  const homeDir = options.homeDir ?? homedir();
  const hasAgentBrowser =
    options.hasAgentBrowser ??
    (async () => {
      const result = await execa('agent-browser', ['--help'], { reject: false });
      return result.exitCode === 0;
    });

  if (!(await hasAgentBrowser())) {
    throw new Error('agent-browser was not found on PATH');
  }

  const pluginRoot = join(homeDir, 'plugins', 'agent-browser');
  const pluginManifestDir = join(pluginRoot, '.codex-plugin');
  const marketplacePath = join(homeDir, '.agents', 'plugins', 'marketplace.json');

  await mkdir(pluginManifestDir, { recursive: true });
  await mkdir(join(homeDir, '.agents', 'plugins'), { recursive: true });

  await writeFile(
    join(pluginManifestDir, 'plugin.json'),
    `${JSON.stringify(renderPluginJson(), null, 2)}\n`,
  );
  await writeFile(
    join(pluginRoot, '.mcp.json'),
    `${JSON.stringify(renderMcpJson(), null, 2)}\n`,
  );

  let marketplace = renderMarketplaceJson();
  try {
    marketplace = buildMarketplaceJson(JSON.parse(await readFile(marketplacePath, 'utf8')));
  } catch {
    // Use the default template when no marketplace file exists yet.
  }

  await writeFile(marketplacePath, `${JSON.stringify(marketplace, null, 2)}\n`);

  console.log(
    [
      'Codex bootstrap is ready.',
      `Plugin files were written to ${join(homeDir, 'plugins', 'agent-browser')}.`,
      'Restart Codex or start a new session so the new plugin is loaded.',
    ].join(' '),
  );
}
