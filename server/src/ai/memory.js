class SessionMemory {
  constructor() {
    this.sessions = new Map();
    this.ttl = 30 * 60 * 1000;
  }

  get(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    if (Date.now() - session.lastAccess > this.ttl) {
      this.sessions.delete(sessionId);
      return null;
    }
    session.lastAccess = Date.now();
    return session.data;
  }

  set(sessionId, data) {
    const existing = this.sessions.get(sessionId) || { data: {}, lastAccess: Date.now() };
    existing.data = { ...existing.data, ...data };
    existing.lastAccess = Date.now();
    this.sessions.set(sessionId, existing);
    return existing.data;
  }

  update(sessionId, key, value) {
    const existing = this.sessions.get(sessionId);
    if (!existing) {
      return this.set(sessionId, { [key]: value });
    }
    existing.data[key] = value;
    existing.lastAccess = Date.now();
    return existing.data;
  }

  delete(sessionId) {
    this.sessions.delete(sessionId);
  }

  getStats() {
    return {
      activeSessions: this.sessions.size,
      sessions: Array.from(this.sessions.entries()).map(([id, s]) => ({
        id,
        lastAccess: s.lastAccess,
        dataKeys: Object.keys(s.data),
      })),
    };
  }
}

export const memory = new SessionMemory();
