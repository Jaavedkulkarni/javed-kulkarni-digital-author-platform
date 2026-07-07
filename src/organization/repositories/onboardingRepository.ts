import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';

export class OnboardingRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async becomeAuthor(displayName: string): Promise<string> {
    const { data, error } = await this.client.rpc('become_author', {
      p_display_name: displayName,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Author onboarding did not return an author id.');
    }

    return data;
  }
}

export function createOnboardingRepository(client: TypedSupabaseClient): OnboardingRepository {
  return new OnboardingRepository(client);
}
