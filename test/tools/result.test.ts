import { describe, expect, expectTypeOf, it } from 'vitest';
import { makeSuccess, mapExecutionError } from '../../src/tools/result.js';

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

describe('makeSuccess', () => {
  it('returns a structured success envelope with the provided session and tab', () => {
    const tab = {
      id: 7,
      url: 'https://example.com',
      title: 'Example Domain',
      active: true,
    };
    const result = makeSuccess({ count: 1, label: 'ok' }, 'default', tab);

    expect(result).toEqual({
      ok: true,
      session: 'default',
      tab,
      data: {
        count: 1,
        label: 'ok',
      },
    });
  });

  it('preserves the generic payload type at compile time', () => {
    const result = makeSuccess({ count: 1, label: 'ok' });

    expectTypeOf(result.data).toEqualTypeOf<{
      count: number;
      label: string;
    }>();
  });
});
