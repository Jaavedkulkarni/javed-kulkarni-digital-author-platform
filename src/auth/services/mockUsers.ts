import type { AuthRole } from '../types/roles.types';
import { DEFAULT_AUTH_ROLE } from '../types/roles.types';

export interface MockUserRecord {
  id: string;
  email: string;
  password: string;
  role: AuthRole;
  fullName: string;
  emailVerified: boolean;
  createdAt: string;
}

const MOCK_USERS: MockUserRecord[] = [
  {
    id: 'user-reader-001',
    email: 'reader@authoros.com',
    password: 'Password123',
    role: 'reader',
    fullName: 'Reader User',
    emailVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-author-001',
    email: 'author@authoros.com',
    password: 'Password123',
    role: 'author',
    fullName: 'Author User',
    emailVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-publisher-001',
    email: 'publisher@authoros.com',
    password: 'Password123',
    role: 'publisher',
    fullName: 'Publisher User',
    emailVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-admin-001',
    email: 'admin@authoros.com',
    password: 'Password123',
    role: 'admin',
    fullName: 'Admin User',
    emailVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

const REGISTERED_USERS_KEY = 'authoros_mock_registered_users';

function loadRegisteredUsers(): MockUserRecord[] {
  if (typeof window === 'undefined') return [];

  const raw = window.localStorage.getItem(REGISTERED_USERS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as MockUserRecord[];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: MockUserRecord[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

function getAllUsers(): MockUserRecord[] {
  return [...MOCK_USERS, ...loadRegisteredUsers()];
}

export function findMockUserByEmail(email: string): MockUserRecord | undefined {
  const normalized = email.trim().toLowerCase();
  return getAllUsers().find((user) => user.email === normalized);
}

export function findMockUserById(id: string): MockUserRecord | undefined {
  return getAllUsers().find((user) => user.id === id);
}

export function createMockUser(
  email: string,
  password: string,
  fullName: string,
  role: AuthRole = DEFAULT_AUTH_ROLE
): MockUserRecord {
  const normalized = email.trim().toLowerCase();
  const existing = findMockUserByEmail(normalized);

  if (existing) {
    throw new Error('EMAIL_EXISTS');
  }

  const user: MockUserRecord = {
    id: `user-${Date.now()}`,
    email: normalized,
    password,
    role,
    fullName: fullName.trim(),
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };

  const registered = loadRegisteredUsers();
  registered.push(user);
  saveRegisteredUsers(registered);

  return user;
}

export function updateMockUserPassword(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  const registered = loadRegisteredUsers();
  const index = registered.findIndex((user) => user.email === normalized);

  if (index >= 0) {
    registered[index] = { ...registered[index], password };
    saveRegisteredUsers(registered);
    return true;
  }

  const builtIn = MOCK_USERS.find((user) => user.email === normalized);
  if (builtIn) {
    builtIn.password = password;
    return true;
  }

  return false;
}

export function verifyMockUserEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const registered = loadRegisteredUsers();
  const index = registered.findIndex((user) => user.email === normalized);

  if (index >= 0) {
    registered[index] = { ...registered[index], emailVerified: true };
    saveRegisteredUsers(registered);
    return true;
  }

  const builtIn = MOCK_USERS.find((user) => user.email === normalized);
  if (builtIn) {
    builtIn.emailVerified = true;
    return true;
  }

  return false;
}

export function toAuthUser(record: MockUserRecord) {
  return {
    id: record.id,
    email: record.email,
    role: record.role,
    fullName: record.fullName,
    emailVerified: record.emailVerified,
    createdAt: record.createdAt,
  };
}

export function getMockUsersForDev(): readonly MockUserRecord[] {
  return MOCK_USERS;
}
