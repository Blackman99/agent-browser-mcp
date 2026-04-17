import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
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

async function writeJsonAtomic(path: string, value: unknown) {
  const tmpPath = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(tmpPath, `${JSON.stringify(value, null, 2)}\n`);
    await rename(tmpPath, path);
  } catch (error) {
    await rm(tmpPath, { force: true });
    throw error;
  }
}

async function loadMarketplaceJson(path: string) {
  try {
    const raw = await readFile(path, 'utf8');
    const parsed = JSON.parse(raw);

    if (!isObject(parsed)) {
      throw new Error('unsupported marketplace shape');
    }

    if (!Array.isArray(parsed.plugins)) {
      throw new Error('unsupported marketplace shape');
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }

    if (error instanceof SyntaxError) {
      throw new Error(`unable to read existing marketplace at ${path}: invalid JSON`);
    }

    if (error instanceof Error && error.message === 'unsupported marketplace shape') {
      throw new Error(`unable to read existing marketplace at ${path}: unsupported marketplace shape`);
    }

    throw error;
  }
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

  await writeJsonAtomic(join(pluginManifestDir, 'plugin.json'), renderPluginJson());
  await writeJsonAtomic(join(pluginRoot, '.mcp.json'), renderMcpJson());

  const existingMarketplace = await loadMarketplaceJson(marketplacePath);
  const marketplace = existingMarketplace
    ? buildMarketplaceJson(existingMarketplace)
    : renderMarketplaceJson();

  await writeJsonAtomic(marketplacePath, marketplace);

  console.log(
    [
      'Codex bootstrap is ready.',
      `Plugin files were written to ${join(homeDir, 'plugins', 'agent-browser')}.`,
      'Restart Codex or start a new session so the new plugin is loaded.',
    ].join(' '),
  );
}
