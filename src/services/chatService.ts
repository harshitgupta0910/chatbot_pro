interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  error?: {
    message: string;
    type: string;
    code: string;
  };
}

class ChatService {
  private apiKey: string;
  private modelName: string;
  private conversationHistory: Map<string, OpenRouterMessage[]> = new Map();

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    this.modelName = import.meta.env.VITE_MODEL_NAME || 'distilGPT2';

    if (!this.apiKey) {
      console.warn('OpenRouter API key not found in environment variables');
    }
  }

  private async callOpenRouterAPI(messages: OpenRouterMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'ChatBot Pro',
        },
        body: JSON.stringify({ model: this.modelName, messages, temperature: 0.7, max_tokens: 1000 })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API Error!', response.status, errorText);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenRouter API key');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later');
        } else if (response.status === 402) {
          throw new Error('Insufficient credits. Please check your OpenRouter account balance');
        } else if (response.status === 400) {
          throw new Error('Invalid request. The model might not support this format');
        } else {
          throw new Error(`API request failed with status ${response.status}`);
        }
      }

      const data: OpenRouterResponse = await response.json();

      if (data.error) {
        throw new Error(`API Error: ${data.error.message}`);
      }
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      }
      throw new Error('No response generated from the model');
    } catch (error) {
      console.error('Error calling OpenRouter API!', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get a response from the AI model');
    }
  }

  private getConversationHistory(chatId: string): OpenRouterMessage[] {
    return this.conversationHistory.get(chatId) || []; 
  }

  private updateConversationHistory(chatId: string, messages: OpenRouterMessage[]): void {
    const maxMessages = 20;
    const trimmedMessages = messages.slice(-maxMessages);
    this.conversationHistory.set(chatId, trimmedMessages);
  }

  async sendMessage(content: string, chatId: string = 'default'): Promise<string> {
    try {
      // Get conversation history
      const history = this.getConversationHistory(chatId);
      const messages: OpenRouterMessage[] = [];

      if (history.length === 0) {
        messages.push({ role: 'system', content: 'You are a helpful, knowledgeable, and friendly AI assistant. Provide clear, accurate, and helpful responses to user questions. Be conversational but professional.' });
      }
      messages.push(...history);
      messages.push({ role: 'user', content });

      // Call the API
      const response = await this.callOpenRouterAPI(messages);

      // Update conversation history
      const newHistory = [
        ...history,
        { role: 'user', content },
        { role: 'assistant', content: response }
      ];

      this.updateConversationHistory(chatId, newHistory);

      return response;
    } catch (error) {
      console.error('Error in sendMessage!', error);
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return 'Authentication error: Please check your API key configuration';
        } else if (error.message.includes('rate limit')) {
          return "I'm receiving too many requests. Please try again in a few moments.";
        } else if (error.message.includes('credits')) {
          return 'API credits have been exhausted. Please check your account balance';
        } else if (error.message.includes('Invalid request')) {
          return 'There was an issue with the request format. Please try rephrasing your message';
        } else {
          return `I apologize, but I encountered an error: ${error.message}. Please try again.`;
        }
      }
      return "I apologize, but I'm having trouble responding right now. Please try again.";
    }
  }

  clearConversationHistory(chatId: string): void {
    this.conversationHistory.delete(chatId);
  }

  clearAllConversations(): void {
    this.conversationHistory.clear();
  }
}

export const chatService = new ChatService();
