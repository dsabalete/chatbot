import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Health endpoint', () => {
  it('should return status ok with timestamp and version', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('version');
    expect(typeof res.body.version).toBe('string');
    expect(res.body.version.length).toBeGreaterThan(0);
  });
});

describe('About endpoint', () => {
  it('should return professional summary', async () => {
    const res = await request(app).get('/about');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('location');
    expect(res.body).toHaveProperty('summary');
    expect(res.body).toHaveProperty('highlights');
    expect(Array.isArray(res.body.highlights)).toBe(true);
  });
});

describe('Experience endpoint', () => {
  it('should return work experience', async () => {
    const res = await request(app).get('/experience');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('experience');
    expect(Array.isArray(res.body.experience)).toBe(true);
  });
});
