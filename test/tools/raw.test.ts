import { describe, expect, it, vi } from 'vitest';
import { createRawTools } from '../../src/tools/raw.js';

describe('createRawTools', () => {
  it('passes command segments through without reshaping them', async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: 'ok',
      session: 'default',
      tab: undefined,
    });
    const tools = createRawTools(run);

    await tools.runRawCommand({
      args: ['wait', '300'],
      session: 'default',
    });

    expect(run).toHaveBeenCalledWith(['wait', '300'], 'default');
  });
});
