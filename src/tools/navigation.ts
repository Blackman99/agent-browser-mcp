import { makeSuccess } from './result.js';
import type { RunAgentBrowser } from './execute.js';

export function createNavigationTools(run: RunAgentBrowser) {
  return {
    async open(input: { url: string; session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['open', input.url], session);
      return makeSuccess({ url: input.url }, result.session, result.tab);
    },
    async back(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['back'], session);
      return makeSuccess({ action: 'back' }, result.session, result.tab);
    },
    async forward(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['forward'], session);
      return makeSuccess({ action: 'forward' }, result.session, result.tab);
    },
    async reload(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['reload'], session);
      return makeSuccess({ action: 'reload' }, result.session, result.tab);
    },
  };
}
