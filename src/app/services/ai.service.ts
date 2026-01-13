import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        // Initialize Gemini AI with API key from environment
        const API_KEY = environment.geminiApiKey;
        
        // Validate API key
        if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE' || API_KEY.trim() === '') {
            console.error('❌ Gemini API key is not configured. Please set it in environment.ts');
            throw new Error('Gemini API key is not configured');
        }
        
        console.log('🔑 Initializing Gemini AI with API key:', API_KEY.substring(0, 10) + '...');
        this.genAI = new GoogleGenerativeAI(API_KEY);
        
        // Try gemini-2.5-flash first, fallback to gemini-1.5-flash if needed
        try {
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            console.log('✅ Gemini model initialized: gemini-2.5-flash');
        } catch (error) {
            console.warn('⚠️ gemini-2.5-flash not available, trying gemini-1.5-flash');
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            console.log('✅ Gemini model initialized: gemini-1.5-flash');
        }
    }

    /**
     * Get response from Gemini model
     * @param prompt The prompt to send to the AI
     * @returns Promise with the AI response text
     */
    async getGeminiResponse(prompt: string): Promise<string> {
        try {
            console.log('🚀 Sending request to Gemini API...');
            console.log('📝 Prompt:', prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''));
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            console.log('✅ Gemini API response received');
            console.log('📄 Response length:', text.length, 'characters');
            return text;
        } catch (error: any) {
            console.error('❌ Error getting Gemini response:', error);
            console.error('Error details:', {
                message: error?.message || 'Unknown error',
                status: error?.status || 'No status',
                statusText: error?.statusText || 'No status text',
                code: error?.code || 'No code',
                statusCode: error?.statusCode || 'No status code',
                fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
            });
            
            // Check for specific error types
            const errorMessage = error?.message?.toLowerCase() || '';
            const errorCode = error?.code || error?.statusCode || '';
            
            if (errorMessage.includes('api key') || errorCode === 401 || errorCode === 403) {
                throw new Error('Invalid or unauthorized API key. Please check your Gemini API key in environment.ts and ensure it has the correct permissions.');
            } else if (errorMessage.includes('quota') || errorCode === 429) {
                throw new Error('API quota exceeded. Please try again later or check your API quota limits.');
            } else if (errorMessage.includes('rate limit')) {
                throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            } else if (errorMessage.includes('model') || errorMessage.includes('not found')) {
                throw new Error('Model not found. The model name might be incorrect. Please check the Gemini API documentation for available models.');
            } else if (errorMessage.includes('permission') || errorMessage.includes('enable')) {
                throw new Error('API not enabled. Please enable the Gemini API in Google Cloud Console for your project.');
            }
            
            throw new Error(`Gemini API error: ${error?.message || 'Unknown error'}`);
        }
    }

    /**
     * Test method with a sample prompt
     */
    async testGemini(): Promise<string> {
        const samplePrompt = 'Tell me an interesting fact about universities in 2 sentences.';
        console.log('🧪 Testing Gemini API...');
        console.log('📝 Sending prompt:', samplePrompt);

        try {
            const response = await this.getGeminiResponse(samplePrompt);
            console.log('✅ Gemini Response:', response);
            return response;
        } catch (error: any) {
            console.error('❌ Failed to get response:', error);
            console.error('💡 Troubleshooting tips:');
            console.error('   1. Check if your API key is correct in environment.ts');
            console.error('   2. Verify the Gemini API is enabled in Google Cloud Console');
            console.error('   3. Check if your API key has the necessary permissions');
            console.error('   4. Ensure you have available quota for the Gemini API');
            throw error;
        }
    }

    /**
     * Verify API key is configured and accessible
     */
    isApiKeyConfigured(): boolean {
        const apiKey = environment.geminiApiKey;
        return !!(apiKey && 
                 apiKey !== 'YOUR_GEMINI_API_KEY_HERE' && 
                 apiKey.trim() !== '' &&
                 apiKey.startsWith('AIza'));
    }
}
