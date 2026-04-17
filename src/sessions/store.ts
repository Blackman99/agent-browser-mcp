import type { TabMetadata } from '../schema/common.js';

type SessionRecord = {
  name: string;
  tabs: Map<number, TabMetadata>;
};

export class SessionStore {
  private sessions = new Map<string, SessionRecord>();

  private currentSessionName = 'default';

  ensureSession(name = 'default') {
    let record = this.sessions.get(name);
    if (!record) {
      record = { name, tabs: new Map() };
      this.sessions.set(name, record);
    }

    this.currentSessionName = name;
    return record;
  }

  getCurrentSession() {
    return this.sessions.get(this.currentSessionName) ?? null;
  }

  upsertTab(sessionName: string, tab: TabMetadata) {
    const session = this.ensureSession(sessionName);

    if (tab.active) {
      for (const existing of session.tabs.values()) {
        existing.active = false;
      }
    }

    session.tabs.set(tab.id, tab);
  }

  getActiveTab(sessionName: string) {
    const session = this.sessions.get(sessionName);
    if (!session) {
      return null;
    }

    return [...session.tabs.values()].find((tab) => tab.active) ?? null;
  }
}
