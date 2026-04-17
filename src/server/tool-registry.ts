import { createInteractionTools } from '../tools/interaction.js';
import { createNavigationTools } from '../tools/navigation.js';
import { createRuntimeTools } from '../tools/runtime.js';
import { createSessionTools } from '../tools/sessions.js';
import { createStorageNetworkTools } from '../tools/storage-network.js';
import { createTabTools } from '../tools/tabs.js';
import { createPageStateTools } from '../tools/page-state.js';
import { createReadTools } from '../tools/read.js';
import { createRawTools } from '../tools/raw.js';
import type { RunAgentBrowser } from '../tools/execute.js';

export function createToolRegistry(run: RunAgentBrowser) {
  const navigation = createNavigationTools(run);
  const interaction = createInteractionTools(run);
  const read = createReadTools(run);
  const tabs = createTabTools(run);
  const runtime = createRuntimeTools(run);
  const storageNetwork = createStorageNetworkTools(run);
  const sessions = createSessionTools(run);
  const pageState = createPageStateTools(run);
  const raw = createRawTools(run);

  return {
    open: navigation.open,
    back: navigation.back,
    forward: navigation.forward,
    reload: navigation.reload,
    click: interaction.click,
    fill: interaction.fill,
    type: interaction.type,
    get_title: read.getTitle,
    get_text: read.getText,
    get_html: read.getHtml,
    tab_list: tabs.tabList,
    tab_new: tabs.tabNew,
    tab_close: tabs.tabClose,
    eval: runtime.eval,
    cookies_get: storageNetwork.cookiesGet,
    network_requests: storageNetwork.networkRequests,
    session_current: sessions.current,
    session_list: sessions.list,
    snapshot: pageState.snapshot,
    screenshot: pageState.screenshot,
    wait: pageState.wait,
    run_raw_command: raw.runRawCommand,
    session_close: async ({ session = 'default' }: { session?: string }) => {
      return sessions.close({ session });
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
