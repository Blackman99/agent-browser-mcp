import { execa } from 'execa';
import { describe, expect, it, vi } from 'vitest';
import { createAgentBrowserRunner } from '../../src/tools/execute.js';

vi.mock('execa', () => ({
  execa: vi.fn(),
}));

describe('createAgentBrowserRunner', () => {
  it('passes the session as a global flag before the command args', async () => {
    vi.mocked(execa).mockResolvedValue({
      stdout: '',
      stderr: '',
      exitCode: 0,
    } as never);

    const run = createAgentBrowserRunner('agent-browser');
    await run(['open', 'https://example.com'], 'qa');

    expect(execa).toHaveBeenCalledWith(
      'agent-browser',
      ['--session', 'qa', 'open', 'https://example.com'],
      { reject: false },
    );
  });

  it('throws a structured error when the CLI exits non-zero', async () => {
    vi.mocked(execa).mockResolvedValue({
      stdout: '',
      stderr: 'boom',
      exitCode: 2,
    } as never);

    const run = createAgentBrowserRunner('agent-browser');

    await expect(run(['reload'])).rejects.toMatchObject({
      command: ['agent-browser', '--session', 'default', 'reload'],
      exitCode: 2,
      stderr: 'boom',
      session: 'default',
    });
  });
});
