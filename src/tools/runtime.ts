import { makeSuccess } from './result.js';
import type { RunAgentBrowser } from './execute.js';

export function createRuntimeTools(run: RunAgentBrowser) {
  return {
    async eval(input: { script: string; session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['eval', input.script], session);
      return makeSuccess({ output: result.stdout }, result.session, result.tab);
    },
  };
}
