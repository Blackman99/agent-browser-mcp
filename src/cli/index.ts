import { serve } from '../server/index.js';

async function main() {
  const command = process.argv[2] ?? 'serve';

  if (command === 'serve') {
    await serve();
    return;
  }

  if (command === 'init-codex') {
    throw new Error('init-codex is not implemented yet');
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
