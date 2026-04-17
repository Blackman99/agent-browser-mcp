import { describe, expect, it, vi } from 'vitest';
import { createMcpServer } from '../../src/server/index.js';

describe('createMcpServer', () => {
  it('invokes the open handler through the MCP registration layer', async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: '',
      stderr: '',
      exitCode: 0,
      session: 'default',
      tab: { id: 1, url: 'https://example.com', title: 'Example Domain', active: true },
    });
    const server = createMcpServer({ run });

    const result = await server.invoke('open', {
      url: 'https://example.com',
      session: 'default',
    });

    expect(run).toHaveBeenCalledWith(['open', 'https://example.com'], 'default');
    expect(result.ok).toBe(true);
  });
});
