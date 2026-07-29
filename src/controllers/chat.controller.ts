import { Request, Response } from 'express';
import {
  ChatRequest,
  ChatResponse,
  ErrorResponse,
  HistoryResponse,
  MessageResponse,
} from '../types/index.js';
import {
  addToHistory,
  clearHistory,
  generateResponse,
  getHistory,
  getRecentHistory,
  trimHistory,
} from '../services/chat.service.js';

export const chat = (req: Request<{}, ChatResponse | ErrorResponse, ChatRequest>, res: Response<ChatResponse | ErrorResponse>) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  addToHistory({ role: 'user', content: message });

  const botResponse = generateResponse(message);
  addToHistory({ role: 'assistant', content: botResponse });

  trimHistory();

  res.json({
    response: botResponse,
    conversationHistory: getRecentHistory(),
  });
};

export const history = (_req: Request, res: Response<HistoryResponse>) => {
  res.json({ conversationHistory: getHistory() });
};

export const clearChatHistory = (_req: Request, res: Response<MessageResponse>) => {
  clearHistory();
  res.json({ message: 'History cleared' });
};
