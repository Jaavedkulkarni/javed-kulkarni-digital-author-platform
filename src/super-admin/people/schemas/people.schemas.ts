import { z } from 'zod';
import type { PeopleStatistics } from '../types/people.types';

export const peopleSortFieldSchema = z.enum(['newest', 'oldest', 'name', 'last_login', 'role']);

export const peopleFiltersSchema = z.object({
  role: z.string().trim().default(''),
  status: z.string().trim().default(''),
  verification: z.string().trim().default(''),
  country: z.string().trim().default(''),
  dateFrom: z.string().trim().default(''),
  dateTo: z.string().trim().default(''),
  search: z.string().trim().default(''),
});

export const peoplePaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const peopleQuerySchema = peopleFiltersSchema.merge(peoplePaginationSchema).extend({
  sort: peopleSortFieldSchema.default('newest'),
});

export const peopleStatisticsSchema = z.object({
  totalUsers: z.number().int().nonnegative(),
  activeUsers: z.number().int().nonnegative(),
  pendingUsers: z.number().int().nonnegative(),
  suspendedUsers: z.number().int().nonnegative(),
  verifiedUsers: z.number().int().nonnegative(),
  newUsers30Days: z.number().int().nonnegative(),
});

export const peopleUserSchema = z.object({
  id: z.string().uuid(),
  avatarUrl: z.string().nullable(),
  name: z.string(),
  email: z.string().min(1),
  phone: z.string().nullable(),
  primaryRole: z.string(),
  primaryRoleSlug: z.string(),
  status: z.enum(['active', 'suspended', 'pending', 'deleted']),
  emailVerified: z.boolean(),
  lastLogin: z.string().nullable(),
  createdAt: z.string(),
  country: z.string().nullable(),
  timezone: z.string().nullable(),
});

export const peopleListResultSchema = z.object({
  items: z.array(peopleUserSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const peopleFilterOptionsSchema = z.object({
  roles: z.array(z.object({ value: z.string(), label: z.string() })),
  statuses: z.array(z.object({ value: z.string(), label: z.string() })),
  verification: z.array(z.object({ value: z.string(), label: z.string() })),
  countries: z.array(z.object({ value: z.string(), label: z.string() })),
});

export type PeopleFiltersInput = z.infer<typeof peopleFiltersSchema>;
export type PeopleQueryInput = z.infer<typeof peopleQuerySchema>;
export type PeopleUserDto = z.infer<typeof peopleUserSchema>;
export type PeopleListResultDto = z.infer<typeof peopleListResultSchema>;
export type PeopleFilterOptionsDto = z.infer<typeof peopleFilterOptionsSchema>;

export function createEmptyPeopleFilters(): PeopleFiltersInput {
  return peopleFiltersSchema.parse({});
}

export function parsePeopleQuery(input: unknown): PeopleQueryInput {
  return peopleQuerySchema.parse(input);
}

export function safeParsePeopleQuery(input: unknown) {
  return peopleQuerySchema.safeParse(input);
}

export function parsePeopleStatistics(input: unknown): PeopleStatistics {
  return peopleStatisticsSchema.parse(input);
}

export function parsePeopleListResult(input: unknown): PeopleListResultDto {
  return peopleListResultSchema.parse(input);
}

export function parsePeopleFilterOptions(input: unknown): PeopleFilterOptionsDto {
  return peopleFilterOptionsSchema.parse(input);
}
