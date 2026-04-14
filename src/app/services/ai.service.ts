import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

// Ordered list of models to try. First available model wins.
// gemini-2.5-flash-preview-04-17 → gemini-2.0-flash-lite (stable GA fallback)
const MODEL_CASCADE = [
  'gemini-2.5-flash-preview-04-17',
  'gemini-2.0-flash-lite',
];

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private genAI: GoogleGenerativeAI;

  // Simple in-memory response cache: prompt → response text
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
   * Send a prompt to Gemini, trying each model in MODEL_CASCADE until one succeeds.
   * Caches responses so repeated lookups for the same university skip the API call.
   */
  async getGeminiResponse(prompt: string): Promise<string> {
    // Return cached result if available
    const cacheKey = prompt.substring(0, 200);
    if (this.cache.has(cacheKey)) {
      console.log('📦 Returning cached Gemini response');
      return this.cache.get(cacheKey)!;
    }

    let lastError: Error | null = null;

    for (const modelName of MODEL_CASCADE) {
      try {
        console.log(`🚀 Trying Gemini model: ${modelName}`);
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (!text || text.trim() === '') {
          throw new Error('Empty response from model');
        }

        console.log(`✅ Response received from ${modelName} (${text.length} chars)`);
        this.cache.set(cacheKey, text);
        return text;

      } catch (err: any) {
        const msg = err?.message?.toLowerCase() ?? '';
        const status = err?.status ?? 0;

        console.warn(`⚠️ ${modelName} failed (${status}): ${err?.message}`);

        // Hard-stop errors — no point trying other models
        if (
          msg.includes('api key') ||
          msg.includes('api_key') ||
          status === 401 || status === 403
        ) {
          throw new Error('Invalid or unauthorized API key. Check your Gemini API key in environment.ts.');
        }

        if (msg.includes('quota') || status === 429) {
          throw new Error('Gemini API quota exceeded. Please try again later.');
        }

        // Soft errors (model unavailable / 404) → try next model
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    // All models failed
    console.error('❌ All Gemini models failed. Last error:', lastError?.message);
    throw new Error(`Gemini API unavailable: ${lastError?.message ?? 'Unknown error'}`);
  }

  /** Clears the response cache (useful in tests or after key rotation). */
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
