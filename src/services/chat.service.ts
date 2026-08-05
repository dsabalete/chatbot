import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/index.js';
import { invokeClaude } from './bedrock.service.js';
import { saveMessage, getConversationHistory, deleteConversationHistory } from './dynamodb.service.js';

const MAX_HISTORY = 20;
const RESPONSE_WINDOW = 10;

let conversationHistory: Message[] = [];
let currentConversationId: string = uuidv4();

export function getHistory(): Message[] {
  return conversationHistory;
}

export function generateConversationId(): string {
  return uuidv4();
}

export async function addToHistory(message: Message, conversationId?: string): Promise<string> {
  const cid = conversationId || currentConversationId;
  const timestamp = Date.now();

  try {
    await saveMessage({
      conversationId: cid,
      timestamp,
      role: message.role,
      content: message.content,
    });
  } catch (error) {
    console.error('Failed to save to DynamoDB:', error);
  }

  conversationHistory.push(message);
  trimHistory();

  return cid;
}

export async function getHistoryFromDb(conversationId: string): Promise<Message[]> {
  try {
    const messages = await getConversationHistory(conversationId);
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  } catch (error) {
    console.error('Failed to fetch from DynamoDB:', error);
    return conversationHistory;
  }
}

export function clearHistory(): void {
  conversationHistory = [];
}

export async function clearHistoryFromDb(conversationId: string): Promise<void> {
  try {
    await deleteConversationHistory(conversationId);
  } catch (error) {
    console.error('Failed to clear DynamoDB history:', error);
  }
  clearHistory();
}

export function getRecentHistory(): Message[] {
  return conversationHistory.slice(-RESPONSE_WINDOW);
}

export function trimHistory(): void {
  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory = conversationHistory.slice(-MAX_HISTORY);
  }
}

export async function generateBedrockResponse(messages: Message[]): Promise<string> {
  const bedrockMessages = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  return invokeClaude(bedrockMessages);
}

export function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! How can I help you today?';
  }

  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return 'Goodbye! Have a great day!';
  }

  if (lowerMessage.includes('help')) {
    return 'I can help you with basic questions. Try saying hello, asking how I am, or saying goodbye!';
  }

  if (lowerMessage.includes('how are you')) {
    return "I'm doing well, thank you for asking! How about you?";
  }

  if (lowerMessage.includes('name')) {
    return "I'm a simple chatbot. You can call me ChatBot!";
  }

  if (lowerMessage.includes('weather')) {
    return "I don't have access to weather data, but I hope it's nice where you are!";
  }

  if (lowerMessage.includes('time')) {
    return `The current time is ${new Date().toLocaleTimeString()}.`;
  }

  if (lowerMessage.includes('date')) {
    return `Today is ${new Date().toLocaleDateString()}.`;
  }

  if (lowerMessage.includes('joke')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised!",
      "Why don't eggs tell jokes? They'd crack each other up!",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  const responses = [
    "That's interesting! Tell me more.",
    "I see. What else would you like to talk about?",
    "Hmm, I'm not sure I understand. Could you rephrase that?",
    "That's a good point! What do you think about it?",
    "Interesting perspective! Anything else on your mind?",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
