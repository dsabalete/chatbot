import { describe, it, expect, beforeEach } from 'vitest';
import {
  getHistory,
  addToHistory,
  clearHistory,
  getRecentHistory,
  trimHistory,
  generateResponse,
} from './chat.service.js';
import { Message } from '../types/index.js';

describe('Chat Service', () => {
  beforeEach(() => {
    clearHistory();
  });

  describe('getHistory', () => {
    it('should return empty array initially', () => {
      expect(getHistory()).toEqual([]);
    });
  });

  describe('addToHistory', () => {
    it('should add a message to history', async () => {
      const msg: Message = { role: 'user', content: 'hello' };
      await addToHistory(msg);
      expect(getHistory()).toEqual([msg]);
    });

    it('should preserve order of messages', async () => {
      const msg1: Message = { role: 'user', content: 'first' };
      const msg2: Message = { role: 'assistant', content: 'second' };
      await addToHistory(msg1);
      await addToHistory(msg2);
      expect(getHistory()).toEqual([msg1, msg2]);
    });
  });

  describe('clearHistory', () => {
    it('should reset history to empty', async () => {
      await addToHistory({ role: 'user', content: 'test' });
      clearHistory();
      expect(getHistory()).toEqual([]);
    });
  });

  describe('getRecentHistory', () => {
    it('should return all messages when fewer than 10', async () => {
      await addToHistory({ role: 'user', content: '1' });
      await addToHistory({ role: 'assistant', content: '2' });
      expect(getRecentHistory()).toHaveLength(2);
    });

    it('should return only the last 10 messages', async () => {
      for (let i = 0; i < 15; i++) {
        await addToHistory({ role: 'user', content: `msg ${i}` });
      }
      const recent = getRecentHistory();
      expect(recent).toHaveLength(10);
      expect(recent[0].content).toBe('msg 5');
    });
  });

  describe('trimHistory', () => {
    it('should not trim when under limit', async () => {
      for (let i = 0; i < 10; i++) {
        await addToHistory({ role: 'user', content: `msg ${i}` });
      }
      trimHistory();
      expect(getHistory()).toHaveLength(10);
    });

    it('should trim to 20 messages when over limit', async () => {
      for (let i = 0; i < 25; i++) {
        await addToHistory({ role: 'user', content: `msg ${i}` });
      }
      trimHistory();
      expect(getHistory()).toHaveLength(20);
      expect(getHistory()[0].content).toBe('msg 5');
    });
  });

  describe('generateResponse', () => {
    it('should respond to greeting with hello message', () => {
      const response = generateResponse('Hello!');
      expect(response).toBe('Hello! How can I help you today?');
    });

    it('should respond to "hi"', () => {
      const response = generateResponse('hi there');
      expect(response).toBe('Hello! How can I help you today?');
    });

    it('should respond to "hey"', () => {
      const response = generateResponse('hey!');
      expect(response).toBe('Hello! How can I help you today?');
    });

    it('should respond to goodbye', () => {
      const response = generateResponse('goodbye');
      expect(response).toBe('Goodbye! Have a great day!');
    });

    it('should respond to "bye"', () => {
      const response = generateResponse('bye');
      expect(response).toBe('Goodbye! Have a great day!');
    });

    it('should respond to help request', () => {
      const response = generateResponse('help me');
      expect(response).toContain('basic questions');
    });

    it('should respond to "how are you"', () => {
      const response = generateResponse('how are you?');
      expect(response).toBe("I'm doing well, thank you for asking! How about you?");
    });

    it('should respond to name question', () => {
      const response = generateResponse('what is your name?');
      expect(response).toContain('ChatBot');
    });

    it('should respond to weather question', () => {
      const response = generateResponse('what is the weather?');
      expect(response).toContain("don't have access to weather data");
    });

    it('should respond to time question', () => {
      const response = generateResponse('what time is it?');
      expect(response).toMatch(/^The current time is .+\.$/);
    });

    it('should respond to date question', () => {
      const response = generateResponse("what's the date?");
      expect(response).toMatch(/^Today is .+\.$/);
    });

    it('should respond to joke request with a joke', () => {
      const response = generateResponse('tell me a joke');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should respond with a default response for unmatched input', () => {
      const response = generateResponse('xyzzy foobar');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', () => {
      const response = generateResponse('HELLO');
      expect(response).toBe('Hello! How can I help you today?');
    });
  });
});
