import { describe, it, expect } from 'vitest';
import { parseProfessionalSummary, parseWorkExperience } from './cv.service.js';

describe('CV Service', () => {
  describe('parseProfessionalSummary', () => {
    it('should return parsed summary with name, title, location', () => {
      const result = parseProfessionalSummary();

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('location');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('highlights');
      expect(typeof result.name).toBe('string');
      expect(typeof result.title).toBe('string');
      expect(typeof result.location).toBe('string');
      expect(typeof result.summary).toBe('string');
      expect(Array.isArray(result.highlights)).toBe(true);
    });
  });

  describe('parseWorkExperience', () => {
    it('should return parsed work experience', () => {
      const result = parseWorkExperience();

      expect(result).toHaveProperty('experience');
      expect(Array.isArray(result.experience)).toBe(true);

      if (result.experience.length > 0) {
        const firstExp = result.experience[0];
        expect(firstExp).toHaveProperty('role');
        expect(firstExp).toHaveProperty('company');
        expect(firstExp).toHaveProperty('period');
        expect(firstExp).toHaveProperty('achievements');
        expect(Array.isArray(firstExp.achievements)).toBe(true);
      }
    });
  });
});
