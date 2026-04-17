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
    marketplace = JSON.parse(await readFile(marketplacePath, 'utf8'));
    marketplace.plugins = marketplace.plugins.filter(
      (entry: { name: string }) => entry.name !== 'agent-browser',
    );
    marketplace.plugins.push(renderMarketplaceJson().plugins[0]);
  } catch {
    // Use the default template when no marketplace file exists yet.
  }

  await writeFile(marketplacePath, `${JSON.stringify(marketplace, null, 2)}\n`);
}
