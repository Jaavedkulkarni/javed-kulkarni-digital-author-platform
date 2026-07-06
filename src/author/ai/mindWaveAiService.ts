import type { MindWaveAiProvider, MindWaveAiRequest, MindWaveAiResponse } from './types';
import { StubMindWaveAiProvider } from './stubMindWaveAiProvider';

export class MindWaveAiService {
  constructor(private readonly provider: MindWaveAiProvider = new StubMindWaveAiProvider()) {}

  getProvider(): MindWaveAiProvider {
    return this.provider;
  }

  async isAvailable(): Promise<boolean> {
    return this.provider.isAvailable();
  }

  async execute(request: MindWaveAiRequest): Promise<MindWaveAiResponse> {
    return this.provider.execute(request);
  }

  getSupportedFeatures() {
    return this.provider.getSupportedFeatures();
  }
}

export function createMindWaveAiService(provider?: MindWaveAiProvider): MindWaveAiService {
  return new MindWaveAiService(provider);
}
