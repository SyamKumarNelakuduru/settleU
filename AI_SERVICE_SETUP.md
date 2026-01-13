# AI Service Setup (Gemini 2.5 Integration)

## Overview
The AI service integrates Google's Gemini 2.0 Flash model into the application for AI-powered responses.

## Setup Instructions

### 1. Get Your Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

### 2. Configure the API Key
Open `/src/app/services/ai.service.ts` and replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:

```typescript
const API_KEY = 'your-actual-api-key-here';
```

**Security Note:** For production, use environment variables instead of hardcoding the API key.

### 3. Test the Integration
1. Navigate to the Compare page in your application
2. Look for any university card with a "Public" or "Private" badge
3. Click on the badge (it now has a pointer cursor)
4. Open your browser's Developer Console (F12 or Cmd+Option+I)
5. You should see:
   - "Testing Gemini AI..."
   - "Sending prompt to Gemini: Tell me an interesting fact about universities in 2 sentences."
   - "Gemini Response: [AI generated response]"

## Usage

### Basic Usage
```typescript
import { AiService } from './services/ai.service';

constructor(private aiService: AiService) {}

async getResponse() {
  const prompt = 'Your question here';
  const response = await this.aiService.getGeminiResponse(prompt);
  console.log(response);
}
```

### Test Method
```typescript
// Quick test with sample prompt
await this.aiService.testGemini();
```

## Files Modified
- ✅ Created: `/src/app/services/ai.service.ts` - AI service with Gemini integration
- ✅ Modified: `/src/app/components/compare/compare.ts` - Added AI service injection and test method
- ✅ Modified: `/src/app/components/compare/compare.html` - Added click event on type badge

## Model Information
- **Model**: `gemini-2.0-flash-exp`
- **Provider**: Google Generative AI
- **Package**: `@google/generative-ai`

## Next Steps
Consider:
- Moving the API key to environment variables
- Adding loading states for AI responses
- Implementing user-facing AI features
- Error handling and retry logic
- Rate limiting and caching
