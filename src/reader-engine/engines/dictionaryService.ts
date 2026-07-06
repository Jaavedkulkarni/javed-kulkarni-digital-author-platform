export interface DictionaryLookupRequest {
  word: string;
  language?: string;
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  definitions: string[];
  partOfSpeech?: string;
}

export interface DictionaryProvider {
  lookup(request: DictionaryLookupRequest): Promise<DictionaryEntry | null>;
}

export class DictionaryService {
  constructor(private readonly provider: DictionaryProvider) {}

  async lookupWord(word: string, language?: string): Promise<DictionaryEntry | null> {
    const normalized = word.trim().toLowerCase();
    if (!normalized) return null;
    return this.provider.lookup({ word: normalized, language });
  }
}

export class StubDictionaryProvider implements DictionaryProvider {
  async lookup(request: DictionaryLookupRequest): Promise<DictionaryEntry | null> {
    return {
      word: request.word,
      definitions: [`Definition for "${request.word}" (dictionary provider not configured).`],
      partOfSpeech: 'noun',
    };
  }
}

export function createDictionaryService(provider?: DictionaryProvider): DictionaryService {
  return new DictionaryService(provider ?? new StubDictionaryProvider());
}
