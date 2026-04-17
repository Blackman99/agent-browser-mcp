import { describe, expect, it } from 'vitest';
import { listToolNames } from '../../src/server/tool-registry.js';

describe('tool registry', () => {
  it('registers the required public tools', () => {
    expect(listToolNames()).toContain('open');
    expect(listToolNames()).toContain('get_title');
    expect(listToolNames()).toContain('snapshot');
    expect(listToolNames()).toContain('run_raw_command');
    expect(listToolNames()).toContain('session_close');
  });
});
