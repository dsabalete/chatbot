import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { config } from '../config/index.js';

const withApiKey = () => ({ 'X-API-Key': config.apiKey });

describe('API key protection', () => {
  it('should reject requests without a valid API key', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should reject requests with an invalid API key', async () => {
    const res = await request(app).get('/health').set('X-API-Key', 'wrong-key');

    expect(res.status).toBe(401);
  });
});

describe('Health endpoint', () => {
  it('should return status ok with timestamp and version', async () => {
    const res = await request(app).get('/health').set(withApiKey());

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
    const res = await request(app).get('/about').set(withApiKey());

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
    const res = await request(app).get('/experience').set(withApiKey());

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('experience');
    expect(Array.isArray(res.body.experience)).toBe(true);
  });
});
