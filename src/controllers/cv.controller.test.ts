import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { health, about, experience } from './cv.controller.js';

function mockRes() {
  const res = {
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe('CV Controller', () => {
  describe('health', () => {
    it('should return status ok with timestamp and version', () => {
      const res = mockRes();

      health({} as Request, res);

      const json = (res.json as any).mock.calls[0][0];
      expect(json.status).toBe('ok');
      expect(json.timestamp).toBeDefined();
      expect(new Date(json.timestamp).toISOString()).toBe(json.timestamp);
      expect(typeof json.version).toBe('string');
      expect(json.version.length).toBeGreaterThan(0);
    });
  });

  describe('about', () => {
    it('should return professional summary', () => {
      const res = mockRes();

      about({} as Request, res);

      const json = (res.json as any).mock.calls[0][0];
      expect(json).toHaveProperty('name');
      expect(json).toHaveProperty('title');
      expect(json).toHaveProperty('location');
      expect(json).toHaveProperty('summary');
      expect(json).toHaveProperty('highlights');
      expect(Array.isArray(json.highlights)).toBe(true);
    });
  });

  describe('experience', () => {
    it('should return work experience array', () => {
      const res = mockRes();

      experience({} as Request, res);

      const json = (res.json as any).mock.calls[0][0];
      expect(json).toHaveProperty('experience');
      expect(Array.isArray(json.experience)).toBe(true);
    });
  });
});
