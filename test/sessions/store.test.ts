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

  it('keeps the same active tab object active when it is upserted again', () => {
    const store = new SessionStore();
    const session = store.ensureSession();
    const tab = {
      id: 1,
      url: 'https://example.com',
      title: 'Example Domain',
      active: true,
    };

    store.upsertTab(session.name, tab);
    store.upsertTab(session.name, tab);

    expect(store.getActiveTab(session.name)).toBe(tab);
    expect(tab.active).toBe(true);
  });

  it('deactivates the previous active tab when a different active tab is stored', () => {
    const store = new SessionStore();
    const session = store.ensureSession();
    const firstTab = { id: 1, active: true };
    const secondTab = { id: 2, active: true };

    store.upsertTab(session.name, firstTab);
    store.upsertTab(session.name, secondTab);

    expect(store.getActiveTab(session.name)).toBe(secondTab);
    expect(firstTab.active).toBe(false);
    expect(secondTab.active).toBe(true);
  });
});
