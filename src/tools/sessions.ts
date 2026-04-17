import { makeSuccess } from './result.js';
import type { RunAgentBrowser } from './execute.js';

export function createSessionTools(run: RunAgentBrowser) {
  return {
    async current(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['session'], session);
      return makeSuccess({ session: result.stdout.trim() }, result.session, result.tab);
    },
    async list(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['session', 'list'], session);
      return makeSuccess({ sessions: result.stdout }, result.session, result.tab);
    },
    async close(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['close'], session);
      return makeSuccess({ closed: true }, result.session, result.tab);
    },
  };
}
