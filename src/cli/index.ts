import { inspect } from 'node:util';
import { pathToFileURL } from 'node:url';
import { initCodex } from './init-codex.js';
import { serve } from '../server/index.js';

export function formatThrownValue(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return inspect(error, { depth: null, colors: false, breakLength: Infinity });
}

async function main() {
  const command = process.argv[2] ?? 'serve';

  if (command === 'serve') {
    await serve();
    return;
  }

  if (command === 'init-codex') {
    await initCodex();
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

const isMainModule = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;

if (isMainModule) {
  main().catch((error) => {
    process.stderr.write(`${formatThrownValue(error)}\n`);
    process.exit(1);
  });
}
