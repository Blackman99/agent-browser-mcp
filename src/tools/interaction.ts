import { makeSuccess } from './result.js';
import type { RunAgentBrowser } from './execute.js';

export function createInteractionTools(run: RunAgentBrowser) {
  return {
    async click(input: { selector: string; session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['click', input.selector], session);
      return makeSuccess({ action: 'click', selector: input.selector }, result.session, result.tab);
    },
    async fill(input: { selector: string; text: string; session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['fill', input.selector, input.text], session);
      return makeSuccess({ action: 'fill', selector: input.selector }, result.session, result.tab);
    },
    async type(input: { selector: string; text: string; session?: string }) {
      const session = input.session ?? 'default';
      const result = await run(['type', input.selector, input.text], session);
      return makeSuccess({ action: 'type', selector: input.selector }, result.session, result.tab);
    },
  };
}
