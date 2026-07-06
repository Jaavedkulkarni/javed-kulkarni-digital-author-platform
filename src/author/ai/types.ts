export type MindWaveAiFeature =
  | 'writing_assistant'
  | 'seo_optimizer'
  | 'cover_suggestions'
  | 'marketing_copy'
  | 'reader_insights'
  | 'pricing_recommendations';

export interface MindWaveAiRequest {
  authorId: string;
  feature: MindWaveAiFeature;
  context: Record<string, unknown>;
  prompt?: string;
}

export interface MindWaveAiResponse {
  feature: MindWaveAiFeature;
  result: string | null;
  suggestions: string[];
  metadata: Record<string, unknown>;
  status: 'not_configured' | 'ready' | 'unavailable';
}

export interface MindWaveAiProvider {
  readonly providerId: 'mindwave-ai';
  isAvailable(): Promise<boolean>;
  execute(request: MindWaveAiRequest): Promise<MindWaveAiResponse>;
  getSupportedFeatures(): MindWaveAiFeature[];
}
