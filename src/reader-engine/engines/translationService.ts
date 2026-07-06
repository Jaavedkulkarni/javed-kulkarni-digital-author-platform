export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationProvider {
  translate(request: TranslationRequest): Promise<TranslationResult>;
  getSupportedLanguages(): string[];
}

export class TranslationService {
  constructor(private readonly provider: TranslationProvider) {}

  async translateText(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TranslationResult> {
    return this.provider.translate({ text, sourceLanguage, targetLanguage });
  }

  getSupportedLanguages(): string[] {
    return this.provider.getSupportedLanguages();
  }
}

export class StubTranslationProvider implements TranslationProvider {
  async translate(request: TranslationRequest): Promise<TranslationResult> {
    return {
      originalText: request.text,
      translatedText: `[${request.targetLanguage}] ${request.text}`,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
    };
  }

  getSupportedLanguages(): string[] {
    return ['en', 'mr', 'hi'];
  }
}

export function createTranslationService(provider?: TranslationProvider): TranslationService {
  return new TranslationService(provider ?? new StubTranslationProvider());
}
