import { makeSuccess } from './result.js';
import type { RunAgentBrowser } from './execute.js';

export function createPageStateTools(run: RunAgentBrowser) {
  return {
    async wait(input: { target: string; session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['wait', input.target], session);
      return makeSuccess({ waitedFor: input.target, output: result.stdout }, result.session, result.tab);
    },
    async snapshot(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['snapshot'], session);
      return makeSuccess({ snapshot: result.stdout }, result.session, result.tab);
    },
    async screenshot(input: { path?: string; session?: string }) {
      const session = input.session ?? 'default';
      const args = input.path ? ['screenshot', input.path] : ['screenshot'];
      const result = await run(args, session);
      return makeSuccess({ screenshot: input.path ?? result.stdout }, result.session, result.tab);
    },
  };
}
