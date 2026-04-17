import { makeSuccess } from './result.js';
import type { RunAgentBrowser } from './execute.js';

export function createRawTools(run: RunAgentBrowser) {
  return {
    async runRawCommand(input: { args: string[]; session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(input.args, session);
      return makeSuccess({ stdout: result.stdout }, result.session, result.tab);
    },
  };
}
