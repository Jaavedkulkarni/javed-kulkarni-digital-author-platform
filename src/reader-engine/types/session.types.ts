import type { ReaderFormat, ReaderLocation, DeviceInfo } from './common';
import type { ReaderTypography } from './typography.types';
import type { ReaderThemeId } from './common';

export type ReadingSessionStatus = 'idle' | 'loading' | 'active' | 'paused' | 'closed';

export interface ReadingSession {
  id: string;
  userId: string;
  bookId: string;
  format: ReaderFormat;
  status: ReadingSessionStatus;
  location: ReaderLocation;
  theme: ReaderThemeId;
  typography: ReaderTypography;
  startedAt: string;
  lastActiveAt: string;
  deviceInfo: DeviceInfo;
}

export interface StartSessionInput {
  userId: string;
  bookId: string;
  format: ReaderFormat;
  resumeLocation?: ReaderLocation;
  deviceInfo: DeviceInfo;
}

export interface UpdateSessionInput {
  sessionId: string;
  location?: ReaderLocation;
  status?: ReadingSessionStatus;
  theme?: ReaderThemeId;
  typography?: ReaderTypography;
}
