import { createAgentBrowserRunner, type RunAgentBrowser } from '../tools/execute.js';
import { createToolRegistry } from './tool-registry.js';

type ServerOptions = {
  run?: RunAgentBrowser;
};

export function createMcpServer(options: ServerOptions = {}) {
  const run = options.run ?? createAgentBrowserRunner();
  const tools = createToolRegistry(run);

  return {
    tools,
    async invoke(name: string, input: unknown) {
      const handler = tools[name as keyof typeof tools];
      if (typeof handler !== 'function') {
        throw new Error(`Unknown MCP tool: ${name}`);
      }
      return handler(input as never);
    },
  };
}

export async function serve() {
  const server = createMcpServer();
  process.stdout.write(JSON.stringify({ ok: true, toolCount: Object.keys(server.tools).length }) + '\n');
}
