import { createNavigationTools } from '../tools/navigation.js';
import { createPageStateTools } from '../tools/page-state.js';
import { createReadTools } from '../tools/read.js';
import { createRawTools } from '../tools/raw.js';
import { makeSuccess } from '../tools/result.js';
import type { RunAgentBrowser } from '../tools/execute.js';

export function createToolRegistry(run: RunAgentBrowser) {
  const navigation = createNavigationTools(run);
  const read = createReadTools(run);
  const pageState = createPageStateTools(run);
  const raw = createRawTools(run);

  return {
    open: navigation.open,
    back: navigation.back,
    forward: navigation.forward,
    reload: navigation.reload,
    get_title: read.getTitle,
    get_text: read.getText,
    get_html: read.getHtml,
    snapshot: pageState.snapshot,
    screenshot: pageState.screenshot,
    wait: pageState.wait,
    run_raw_command: raw.runRawCommand,
    session_close: async ({ session = 'default' }: { session?: string }) => {
      const result = await run(['close'], session);
      return makeSuccess({ sessionClosed: true }, result.session, result.tab);
    },
  };
}

export function listToolNames() {
  return Object.keys(
    createToolRegistry((async () => {
      throw new Error('not implemented');
    }) as RunAgentBrowser),
  );
}
