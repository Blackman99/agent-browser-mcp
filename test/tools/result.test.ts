import { describe, expect, it } from 'vitest';
import { mapExecutionError } from '../../src/tools/result.js';

describe('mapExecutionError', () => {
  it('returns a structured MCP-style error payload', () => {
    const result = mapExecutionError({
      command: ['agent-browser', 'click', '#missing'],
      exitCode: 1,
      stderr: 'No element matched selector "#missing"',
      session: 'default',
    });

    expect(result.ok).toBe(false);
    expect(result.code).toBe('CLI_EXECUTION_FAILED');
    expect(result.message).toContain('No element matched selector');
    expect(result.details.session).toBe('default');
  });
});
