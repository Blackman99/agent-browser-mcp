import { makeSuccess } from './result.js';
import type { RunAgentBrowser } from './execute.js';

export function createTabTools(run: RunAgentBrowser) {
  return {
    async tabList(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['tab', 'list'], session);
      return makeSuccess({ tabs: result.stdout }, result.session, result.tab);
    },
    async tabNew(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['tab', 'new'], session);
      return makeSuccess({ created: true }, result.session, result.tab);
    },
    async tabClose(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['tab', 'close'], session);
      return makeSuccess({ closed: true }, result.session, result.tab);
    },
  };
}
