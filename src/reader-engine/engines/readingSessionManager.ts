import type { ReadingSession, StartSessionInput, UpdateSessionInput } from '../types/session.types';
import type { ReaderThemeId } from '../types/common';
import { DEFAULT_TYPOGRAPHY, type ReaderTypography } from '../types/typography.types';
import { SESSION_IDLE_TIMEOUT_MS } from '../constants/readerEngine.constants';
import { validateStartSession } from '../validators/sessionValidator';

function createSessionId(): string {
  return `rs_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export class ReadingSessionManager {
  private sessions = new Map<string, ReadingSession>();

  start(input: StartSessionInput): { success: boolean; session?: ReadingSession; errors?: string[] } {
    const validation = validateStartSession(input);
    if (!validation.valid) return { success: false, errors: validation.errors };

    const session: ReadingSession = {
      id: createSessionId(),
      userId: input.userId,
      bookId: input.bookId,
      format: input.format,
      status: 'loading',
      location: input.resumeLocation ?? {},
      theme: 'light',
      typography: { ...DEFAULT_TYPOGRAPHY },
      startedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      deviceInfo: input.deviceInfo,
    };

    this.sessions.set(session.id, session);
    return { success: true, session };
  }

  update(input: UpdateSessionInput): ReadingSession | null {
    const session = this.sessions.get(input.sessionId);
    if (!session) return null;

    const updated: ReadingSession = {
      ...session,
      location: input.location ?? session.location,
      status: input.status ?? session.status,
      theme: input.theme ?? session.theme,
      typography: input.typography ?? session.typography,
      lastActiveAt: new Date().toISOString(),
    };

    this.sessions.set(session.id, updated);
    return updated;
  }

  activate(sessionId: string): ReadingSession | null {
    return this.update({ sessionId, status: 'active' });
  }

  pause(sessionId: string): ReadingSession | null {
    return this.update({ sessionId, status: 'paused' });
  }

  close(sessionId: string): ReadingSession | null {
    const result = this.update({ sessionId, status: 'closed' });
    this.sessions.delete(sessionId);
    return result;
  }

  get(sessionId: string): ReadingSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const idle = Date.now() - new Date(session.lastActiveAt).getTime();
    if (idle > SESSION_IDLE_TIMEOUT_MS && session.status === 'active') {
      return this.update({ sessionId, status: 'paused' });
    }
    return session;
  }

  getActiveForUser(userId: string, bookId: string): ReadingSession | null {
    for (const session of this.sessions.values()) {
      if (
        session.userId === userId &&
        session.bookId === bookId &&
        (session.status === 'active' || session.status === 'loading')
      ) {
        return session;
      }
    }
    return null;
  }

  setTheme(sessionId: string, theme: ReaderThemeId): ReadingSession | null {
    return this.update({ sessionId, theme });
  }

  setTypography(sessionId: string, typography: ReaderTypography): ReadingSession | null {
    return this.update({ sessionId, typography });
  }
}

export function createReadingSessionManager(): ReadingSessionManager {
  return new ReadingSessionManager();
}
