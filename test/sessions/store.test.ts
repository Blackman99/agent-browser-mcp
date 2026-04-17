import { describe, expect, it } from 'vitest';
import { SessionStore } from '../../src/sessions/store.js';

describe('SessionStore', () => {
  it('creates a default session and tracks active tab metadata', () => {
    const store = new SessionStore();

    const session = store.ensureSession();
    store.upsertTab(session.name, {
      id: 1,
      url: 'https://example.com',
      title: 'Example Domain',
      active: true,
    });

    expect(session.name).toBe('default');
    expect(store.getCurrentSession()?.name).toBe('default');
    expect(store.getActiveTab('default')).toEqual({
      id: 1,
      url: 'https://example.com',
      title: 'Example Domain',
      active: true,
    });
  });
});
