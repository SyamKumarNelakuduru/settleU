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
        this.genAI = new GoogleGenerativeAI(API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    /**
     * Get response from Gemini model
     * @param prompt The prompt to send to the AI
     * @returns Promise with the AI response text
     */
    async getGeminiResponse(prompt: string): Promise<string> {
        try {
            console.log('🚀 Sending request to Gemini API...');
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log('✅ Gemini API response received');
            return text;
        } catch (error: any) {
            console.error('❌ Error getting Gemini response:', error);
            console.error('Error details:', {
                message: error?.message || 'Unknown error',
                status: error?.status || 'No status',
                statusText: error?.statusText || 'No status text',
                error: error
            });
            
            // Check for specific error types
            if (error?.message?.includes('API key')) {
                throw new Error('Invalid API key. Please check your Gemini API configuration.');
            } else if (error?.message?.includes('quota')) {
                throw new Error('API quota exceeded. Please try again later.');
            } else if (error?.message?.includes('rate limit')) {
                throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            }
            
            throw error;
        }
    }

    /**
     * Test method with a sample prompt
     */
    async testGemini(): Promise<void> {
        const samplePrompt = 'Tell me an interesting fact about universities in 2 sentences.';
        console.log('Sending prompt to Gemini 2.5 Flash:', samplePrompt);

        try {
            const response = await this.getGeminiResponse(samplePrompt);
            console.log('Gemini Response:', response);
        } catch (error) {
            console.error('Failed to get response:', error);
        }
    }
}
