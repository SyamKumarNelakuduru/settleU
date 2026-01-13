import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
    providedIn: 'root'
})

export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        // Initialize Gemini AI with your API key
        // Replace with your actual API key or use environment variable
        const API_KEY = 'AIzaSyA0YNsHwh9NPNuIpqAw4bGkDojBq1oFGFU';
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
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return text;
        } catch (error) {
            console.error('Error getting Gemini response:', error);
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
