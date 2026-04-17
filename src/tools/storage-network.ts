import { makeSuccess } from './result.js';
import type { RunAgentBrowser } from './execute.js';

export function createStorageNetworkTools(run: RunAgentBrowser) {
  return {
    async cookiesGet(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['cookies', 'get'], session);
      return makeSuccess({ cookies: result.stdout }, result.session, result.tab);
    },
    async networkRequests(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['network', 'requests'], session);
      return makeSuccess({ requests: result.stdout }, result.session, result.tab);
    },
  };
}
