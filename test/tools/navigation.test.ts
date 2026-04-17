import { describe, expect, it, vi } from 'vitest';
import { createNavigationTools } from '../../src/tools/navigation.js';

describe('createNavigationTools', () => {
  it('maps open to an agent-browser open command', async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: '',
      session: 'default',
      tab: { id: 1, url: 'https://example.com', title: 'Example Domain', active: true },
    });
    const tools = createNavigationTools(run);

    await tools.open({ url: 'https://example.com', session: 'default' });

    expect(run).toHaveBeenCalledWith(['open', 'https://example.com'], 'default');
  });
});
