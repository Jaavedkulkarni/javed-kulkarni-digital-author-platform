import { getPeople, suspendPerson, restorePerson, exportPeople } from '../stores/peopleStore';
import type { PeopleFilters } from '../types/people.types';
import type { SuperAdminOperationResult } from '../types/common';

export class PeopleService {
  list(filters?: PeopleFilters) { return getPeople(filters); }
  export(filters?: PeopleFilters) { return exportPeople(filters); }
  suspend(id: string): SuperAdminOperationResult { const r = suspendPerson(id); return r ? { success: true, data: r } : { success: false, errors: ['Not found'] }; }
  restore(id: string): SuperAdminOperationResult { const r = restorePerson(id); return r ? { success: true, data: r } : { success: false, errors: ['Not found'] }; }
}

export function createPeopleService(): PeopleService {
  return new PeopleService();
}
