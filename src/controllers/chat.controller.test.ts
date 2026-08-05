import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Request, Response } from 'express';
import { chat, history, clearChatHistory } from './chat.controller.js';
import {
  clearHistory,
  addToHistory,
  getHistory,
} from '../services/chat.service.js';
import { ChatRequest } from '../types/index.js';
import * as dynamodbService from '../services/dynamodb.service.js';

function mockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

function mockReqWithQuery(query: Record<string, string> = {}) {
  return { query } as unknown as Request;
}

describe('Chat Controller', () => {
  beforeEach(() => {
    clearHistory();
    // Mock DynamoDB to store messages in memory for testing
    const dbStore = new Map<string, Array<{ conversationId: string; role: string; content: string; timestamp: number }>>();
    
    vi.spyOn(dynamodbService, 'saveMessage').mockImplementation(async (message: any) => {
      const key = message.conversationId;
      if (!dbStore.has(key)) {
        dbStore.set(key, []);
      }
      dbStore.get(key)!.push({
        conversationId: message.conversationId,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
      });
    });

    vi.spyOn(dynamodbService, 'getConversationHistory').mockImplementation(async (conversationId: string) => {
      return (dbStore.get(conversationId) || []) as { conversationId: string; role: 'user' | 'assistant'; content: string; timestamp: number; }[];
    });

    vi.spyOn(dynamodbService, 'deleteConversationHistory').mockImplementation(async (conversationId: string) => {
      dbStore.delete(conversationId);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('chat', () => {
    it('should return 400 when message is missing', async () => {
      const req = { body: {} } as Request<{}, any, ChatRequest>;
      const res = mockRes();

      await chat(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
    });

    it('should return 200 with response and history for valid message', async () => {
      const req = { body: { message: 'hello' } } as Request<{}, any, ChatRequest>;
      const res = mockRes();

      await chat(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          response: expect.any(String),
          conversationHistory: expect.any(Array),
        })
      );
    });

    it('should add user message and bot response to history', async () => {
      const req = { body: { message: 'hello' } } as Request<{}, any, ChatRequest>;
      const res = mockRes();

      await chat(req, res);

      const hist = getHistory();
      expect(hist).toHaveLength(2);
      expect(hist[0]).toEqual({ role: 'user', content: 'hello' });
      expect(hist[1].role).toBe('assistant');
    });

    it('should trim history when it exceeds max', async () => {
      const { addToHistory } = await import('../services/chat.service.js');
      const res = mockRes();

      for (let i = 0; i < 25; i++) {
        await addToHistory({ role: 'user', content: `msg ${i}` }, 'test-trim');
      }

      const hist = getHistory();
      expect(hist.length).toBeLessThanOrEqual(20);
    });
  });

  describe('history', () => {
    it('should return conversation history', async () => {
      const conversationId = 'test-conv-1';
      await addToHistory({ role: 'user', content: 'test' }, conversationId);
      const res = mockRes();
      const req = mockReqWithQuery({ conversationId });

      await history(req, res);

      expect(res.json).toHaveBeenCalledWith({
        conversationHistory: [{ role: 'user', content: 'test' }],
      });
    });

    it('should return 400 when conversationId is missing', async () => {
      const res = mockRes();
      const req = mockReqWithQuery({});

      await history(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'conversationId query parameter is required' });
    });
  });

  describe('clearChatHistory', () => {
    it('should clear history and return confirmation', async () => {
      const conversationId = 'test-conv-2';
      await addToHistory({ role: 'user', content: 'test' }, conversationId);
      const res = mockRes();
      const req = mockReqWithQuery({ conversationId });

      await clearChatHistory(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'History cleared' });
    });

    it('should return 400 when conversationId is missing', async () => {
      const res = mockRes();
      const req = mockReqWithQuery({});

      await clearChatHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'conversationId query parameter is required' });
    });
  });
});
