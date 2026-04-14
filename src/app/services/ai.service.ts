import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private genAI: GoogleGenerativeAI;

  // Simple in-memory response cache: cacheKey → response text
  private cache = new Map<string, string>();

  constructor() {
    const API_KEY = environment.geminiApiKey;

    if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE' || API_KEY.trim() === '') {
      console.error('❌ Gemini API key is not configured.');
      throw new Error('Gemini API key is not configured');
    }

    console.log('🔑 Initializing Gemini AI:', API_KEY.substring(0, 10) + '...');
    this.genAI = new GoogleGenerativeAI(API_KEY);
  }

  /**
   * Send a prompt to Gemini (gemini-1.5-flash).
   * Responses are cached in memory so repeat lookups within a session skip the API.
   * Throws a typed error on failure — callers decide how to degrade gracefully.
   */
  async getGeminiResponse(prompt: string): Promise<string> {
    const cacheKey = prompt.substring(0, 300);

    if (this.cache.has(cacheKey)) {
      console.log('📦 Returning cached Gemini response');
      return this.cache.get(cacheKey)!;
    }

    const MODEL = 'gemini-1.5-flash';

    try {
      console.log(`🚀 Calling Gemini model: ${MODEL}`);
      const model = this.genAI.getGenerativeModel({ model: MODEL });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text || text.trim() === '') {
        throw new Error('Empty response received from Gemini');
      }

      console.log(`✅ Gemini response received (${text.length} chars)`);
      this.cache.set(cacheKey, text);
      return text;

    } catch (err: any) {
      // Classify the error for clear logging — never expose a raw SDK error to the UI
      const msg: string = err?.message ?? '';
      const status: number = err?.status ?? err?.statusCode ?? 0;

      if (status === 401 || status === 403 || msg.toLowerCase().includes('api key')) {
        console.error('❌ Gemini auth error — check your API key:', msg);
        throw new Error('GEMINI_AUTH_ERROR');
      }

      if (status === 429 || msg.toLowerCase().includes('quota')) {
        console.error('❌ Gemini quota exceeded:', msg);
        throw new Error('GEMINI_QUOTA_ERROR');
      }

      if (status === 404 || msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no longer available')) {
        console.error(`❌ Gemini model ${MODEL} unavailable (404):`, msg);
        throw new Error('GEMINI_MODEL_UNAVAILABLE');
      }

      console.error('❌ Gemini API error:', msg);
      throw new Error(`GEMINI_ERROR: ${msg}`);
    }
  }

  /** Clears the in-memory cache (e.g. after an API key change). */
  clearCache(): void {
    this.cache.clear();
  }

  isApiKeyConfigured(): boolean {
    const apiKey = environment.geminiApiKey;
    return !!(
      apiKey &&
      apiKey !== 'YOUR_GEMINI_API_KEY_HERE' &&
      apiKey.trim() !== '' &&
      apiKey.startsWith('AIza')
    );
  }
}
