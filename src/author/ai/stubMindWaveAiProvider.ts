import type { MindWaveAiProvider, MindWaveAiRequest, MindWaveAiResponse, MindWaveAiFeature } from './types';

export class StubMindWaveAiProvider implements MindWaveAiProvider {
  readonly providerId = 'mindwave-ai' as const;

  async isAvailable(): Promise<boolean> {
    return false;
  }

  async execute(request: MindWaveAiRequest): Promise<MindWaveAiResponse> {
    return {
      feature: request.feature,
      result: null,
      suggestions: [],
      metadata: { message: 'MindWave AI integration is not yet configured.' },
      status: 'not_configured',
    };
  }

  getSupportedFeatures(): MindWaveAiFeature[] {
    return [
      'writing_assistant',
      'seo_optimizer',
      'cover_suggestions',
      'marketing_copy',
      'reader_insights',
      'pricing_recommendations',
    ];
  }
}
