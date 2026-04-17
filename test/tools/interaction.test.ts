import { describe, expect, it, vi } from 'vitest';
import { createInteractionTools } from '../../src/tools/interaction.js';

describe('createInteractionTools', () => {
  it('maps click to an agent-browser click command', async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: 'ok',
      stderr: '',
      exitCode: 0,
      session: 'default',
    });
    const tools = createInteractionTools(run);

    await tools.click({ selector: '#submit', session: 'default' });

    expect(run).toHaveBeenCalledWith(['click', '#submit'], 'default');
  });
});
