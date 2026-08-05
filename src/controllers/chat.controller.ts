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
  clearHistoryFromDb,
  generateBedrockResponse,
  generateConversationId,
  generateResponse,
  getHistoryFromDb,
} from '../services/chat.service.js';

export const chat = async (
  req: Request<{}, ChatResponse | ErrorResponse, ChatRequest>,
  res: Response<ChatResponse | ErrorResponse>
) => {
  const { message, conversationId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const cid = conversationId || generateConversationId();

    await addToHistory({ role: 'user', content: message }, cid);

    const history = await getHistoryFromDb(cid);

    let botResponse: string;
    try {
      botResponse = await generateBedrockResponse(history);
    } catch (error) {
      console.error('Bedrock error, using fallback:', error);
      botResponse = generateResponse(message);
    }

    await addToHistory({ role: 'assistant', content: botResponse }, cid);

    const updatedHistory = await getHistoryFromDb(cid);

    res.json({
      response: botResponse,
      conversationHistory: updatedHistory.slice(-10),
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const history = async (req: Request, res: Response<HistoryResponse | ErrorResponse>) => {
  const conversationId = req.query.conversationId as string;

  if (!conversationId) {
    return res.status(400).json({ error: 'conversationId query parameter is required' });
  }

  try {
    const history = await getHistoryFromDb(conversationId);
    res.json({ conversationHistory: history });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const clearChatHistory = async (
  req: Request,
  res: Response<MessageResponse | ErrorResponse>
) => {
  const conversationId = req.query.conversationId as string;

  if (!conversationId) {
    return res.status(400).json({ error: 'conversationId query parameter is required' });
  }

  try {
    await clearHistoryFromDb(conversationId);
    res.json({ message: 'History cleared' });
  } catch (error) {
    console.error('History clear error:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
};
