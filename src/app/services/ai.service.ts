import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI;

  // In-memory cache: cacheKey → response text (cleared on key rotation)
  private cache = new Map<string, string>();

  constructor() {
    const API_KEY = environment.geminiApiKey;

    if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE' || API_KEY.trim() === '') {
      throw new Error('Gemini API key is not configured in environment.ts');
    }

    console.log('🔑 Gemini AI initialised (v1 stable):', API_KEY.substring(0, 10) + '...');

    // Use the new @google/genai SDK pointed at the stable v1 endpoint.
    // The old @google/generative-ai package defaulted to v1beta which is
    // where the 404 model-not-found errors came from.
    this.ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: { apiVersion: 'v1' }
    });
  }

  /**
   * Send a text prompt and return the response string.
   * Results are cached per unique prompt prefix so the same university
   * search in one session doesn't hit the API twice.
   */
  async getGeminiResponse(prompt: string): Promise<string> {
    const cacheKey = prompt.substring(0, 300);

    if (this.cache.has(cacheKey)) {
      console.log('📦 Returning cached Gemini response');
      return this.cache.get(cacheKey)!;
    }

    const MODEL = 'gemini-2.5-flash';

    try {
      console.log(`🚀 Gemini request → ${MODEL} (v1)`);

      const result = await this.ai.models.generateContent({
        model: MODEL,
        contents: prompt
      });

      const text = result.text ?? '';

      if (!text.trim()) {
        throw new Error('Empty response received from Gemini');
      }

      console.log(`✅ Gemini response (${text.length} chars)`);
      this.cache.set(cacheKey, text);
      return text;

    } catch (err: any) {
      const msg: string = (err?.message ?? '').toLowerCase();
      const status: number = err?.status ?? err?.statusCode ?? 0;

      if (status === 401 || status === 403 || msg.includes('api key') || msg.includes('api_key')) {
        console.error('❌ Gemini auth failure — check your API key');
        throw new Error('GEMINI_AUTH_ERROR');
      }

      if (status === 429 || msg.includes('quota') || msg.includes('rate limit')) {
        console.error('❌ Gemini quota / rate-limit exceeded');
        throw new Error('GEMINI_QUOTA_ERROR');
      }

      if (status === 404 || msg.includes('not found') || msg.includes('no longer available') || msg.includes('model')) {
        console.error(`❌ Gemini model unavailable: ${err?.message}`);
        throw new Error('GEMINI_MODEL_UNAVAILABLE');
      }

      console.error('❌ Gemini API error:', err?.message);
      throw new Error(`GEMINI_ERROR: ${err?.message ?? 'Unknown'}`);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  isApiKeyConfigured(): boolean {
    const k = environment.geminiApiKey;
    return !!(k && k !== 'YOUR_GEMINI_API_KEY_HERE' && k.trim() !== '' && k.startsWith('AIza'));
  }
}
