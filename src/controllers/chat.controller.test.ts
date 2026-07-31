import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { chat, history, clearChatHistory } from './chat.controller.js';
import {
  clearHistory,
  addToHistory,
  getHistory,
} from '../services/chat.service.js';
import { ChatRequest } from '../types/index.js';

function mockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe('Chat Controller', () => {
  beforeEach(() => {
    clearHistory();
  });

  describe('chat', () => {
    it('should return 400 when message is missing', () => {
      const req = { body: {} } as Request<{}, any, ChatRequest>;
      const res = mockRes();

      chat(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
    });

    it('should return 200 with response and history for valid message', () => {
      const req = { body: { message: 'hello' } } as Request<{}, any, ChatRequest>;
      const res = mockRes();

      chat(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          response: expect.any(String),
          conversationHistory: expect.any(Array),
        })
      );
    });

    it('should add user message and bot response to history', () => {
      const req = { body: { message: 'hello' } } as Request<{}, any, ChatRequest>;
      const res = mockRes();

      chat(req, res);

      const hist = getHistory();
      expect(hist).toHaveLength(2);
      expect(hist[0]).toEqual({ role: 'user', content: 'hello' });
      expect(hist[1].role).toBe('assistant');
    });

    it('should trim history when it exceeds max', () => {
      const req = { body: { message: 'hello' } } as Request<{}, any, ChatRequest>;
      const res = mockRes();

      for (let i = 0; i < 25; i++) {
        chat(req, res);
      }

      const hist = getHistory();
      expect(hist.length).toBeLessThanOrEqual(20);
    });
  });

  describe('history', () => {
    it('should return conversation history', () => {
      addToHistory({ role: 'user', content: 'test' });
      const res = mockRes();

      history({} as Request, res);

      expect(res.json).toHaveBeenCalledWith({
        conversationHistory: [{ role: 'user', content: 'test' }],
      });
    });

    it('should return empty history initially', () => {
      const res = mockRes();

      history({} as Request, res);

      expect(res.json).toHaveBeenCalledWith({ conversationHistory: [] });
    });
  });

  describe('clearChatHistory', () => {
    it('should clear history and return confirmation', () => {
      addToHistory({ role: 'user', content: 'test' });
      const res = mockRes();

      clearChatHistory({} as Request, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'History cleared' });
      expect(getHistory()).toEqual([]);
    });
  });
});
