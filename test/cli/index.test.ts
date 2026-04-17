import { describe, expect, it } from 'vitest';
import { formatThrownValue } from '../../src/cli/index.js';

describe('cli error formatting', () => {
  it('renders thrown objects as useful structured text', () => {
    const output = formatThrownValue({
      command: ['close'],
      exitCode: 1,
      stderr: 'boom',
    });

    expect(output).toContain('command');
    expect(output).toContain('exitCode');
    expect(output).toContain('boom');
  });
});
