import { describe, expect, it } from 'vitest';
import { listToolNames } from '../../src/server/tool-registry.js';

describe('tool registry', () => {
  it('registers the public tools exposed by the current registry', () => {
    const names = listToolNames();

    expect(names).toContain('open');
    expect(names).toContain('get_title');
    expect(names).toContain('snapshot');
    expect(names).toContain('run_raw_command');
    expect(names).toContain('session_close');
    expect(names).toContain('click');
    expect(names).toContain('fill');
    expect(names).toContain('type');
    expect(names).toContain('tab_list');
    expect(names).toContain('tab_new');
    expect(names).toContain('tab_close');
    expect(names).toContain('eval');
    expect(names).toContain('cookies_get');
    expect(names).toContain('network_requests');
    expect(names).toContain('session_current');
    expect(names).toContain('session_list');
  });
});
