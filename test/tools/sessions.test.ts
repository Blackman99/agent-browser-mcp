import { describe, expect, it, vi } from 'vitest';
import { createSessionTools } from '../../src/tools/sessions.js';

describe('createSessionTools', () => {
  it('maps close to an agent-browser close command', async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: '',
      stderr: '',
      exitCode: 0,
      session: 'default',
    });
    const tools = createSessionTools(run);

    await tools.close({ session: 'default' });

    expect(run).toHaveBeenCalledWith(['close'], 'default');
  });
});
