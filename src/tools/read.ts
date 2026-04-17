import { makeSuccess } from './result.js';
import type { RunAgentBrowser } from './execute.js';

export function createReadTools(run: RunAgentBrowser) {
  return {
    async getTitle(input: { session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['get', 'title'], session);
      return makeSuccess({ title: result.stdout.trim() }, result.session, result.tab);
    },
    async getText(input: { selector?: string; session?: string }) {
      const session = input.session ?? 'default';
      const args = input.selector ? ['get', 'text', input.selector] : ['get', 'text'];
      const result = await run(args, session);
      return makeSuccess({ text: result.stdout }, result.session, result.tab);
    },
    async getHtml(input: { selector?: string; session?: string }) {
      const session = input.session ?? 'default';
      const args = input.selector ? ['get', 'html', input.selector] : ['get', 'html'];
      const result = await run(args, session);
      return makeSuccess({ html: result.stdout }, result.session, result.tab);
    },
  };
}
