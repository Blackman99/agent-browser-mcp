import { describe, expect, it, vi } from 'vitest';
import { createReadTools } from '../../src/tools/read.js';

describe('createReadTools', () => {
  it('maps getTitle to `agent-browser get title`', async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: 'Example Domain',
      session: 'default',
      tab: { id: 1, url: 'https://example.com', title: 'Example Domain', active: true },
    });
    const tools = createReadTools(run);

    const result = await tools.getTitle({ session: 'default' });

    expect(run).toHaveBeenCalledWith(['get', 'title'], 'default');
    expect(result.data).toEqual({ title: 'Example Domain' });
  });
});
