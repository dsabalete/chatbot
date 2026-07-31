import { describe, it, expect } from 'vitest';
import { parseProfessionalSummary, parseWorkExperience } from './cv.service.js';

describe('CV Service', () => {
  describe('parseProfessionalSummary', () => {
    it('should parse name, title and location from docs/cv.md', () => {
      const result = parseProfessionalSummary();

      expect(result.name).toBe('David Sabalete Rodríguez');
      expect(result.title).toBe('Senior Full Stack Developer');
      expect(result.location).toBe('Barcelona, Spain · Remote');
    });

    it('should parse summary and highlights', () => {
      const result = parseProfessionalSummary();

      expect(typeof result.summary).toBe('string');
      expect(result.summary.length).toBeGreaterThan(0);
      expect(Array.isArray(result.highlights)).toBe(true);
      expect(result.highlights.length).toBeGreaterThan(0);
      expect(result.highlights.every(h => typeof h === 'string' && h.length > 0)).toBe(true);
    });
  });

  describe('parseWorkExperience', () => {
    it('should return parsed work experience entries', () => {
      const result = parseWorkExperience();

      expect(result).toHaveProperty('experience');
      expect(Array.isArray(result.experience)).toBe(true);
      expect(result.experience.length).toBeGreaterThan(0);
    });

    it('should parse role, company, period and achievements for each entry', () => {
      const result = parseWorkExperience();

      for (const exp of result.experience) {
        expect(typeof exp.role).toBe('string');
        expect(exp.role.length).toBeGreaterThan(0);
        expect(typeof exp.company).toBe('string');
        expect(exp.company.length).toBeGreaterThan(0);
        expect(typeof exp.period).toBe('string');
        expect(exp.period.length).toBeGreaterThan(0);
        expect(Array.isArray(exp.achievements)).toBe(true);
        expect(exp.achievements.length).toBeGreaterThan(0);
      }
    });

    it('should parse the most recent job correctly', () => {
      const result = parseWorkExperience();
      const first = result.experience[0];

      expect(first.role).toBe('Senior Full Stack Developer');
      expect(first.company).toBe('LoveToKnow Media Spain');
      expect(first.period).toBe('November 2019 – January 2026');
      expect(first.achievements).toContain(
        'Led frontend architecture for YourDictionary.com (45M+ monthly visitors) using Vue.js and Nuxt.js + AWS serverless stack with AWS Lambdas, API Gateway, and DynamoDB. Helped monitor performance and system health with AWS CloudWatch and Grafana dashboards.',
      );
    });
  });
});
