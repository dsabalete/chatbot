import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import rateLimit from 'express-rate-limit';

describe('Rate limiter', () => {
  function buildApp(limit: number) {
    const app = express();
    app.use(express.json());
    app.use(
      rateLimit({
        windowMs: 60000,
        limit,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        message: { error: 'Too many chat requests, please try again later.' },
      })
    );
    app.post('/api/chat', (_req, res) => res.json({ response: 'ok' }));
    return app;
  }

  it('should allow requests within the limit', async () => {
    const app = buildApp(3);
    const res = await request(app).post('/api/chat').send({ message: 'hello' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ response: 'ok' });
  });

  it('should return 429 with error message when limit is exceeded', async () => {
    const app = buildApp(2);

    await request(app).post('/api/chat').send({ message: 'hello' });
    await request(app).post('/api/chat').send({ message: 'hello' });
    const res = await request(app).post('/api/chat').send({ message: 'hello' });

    expect(res.status).toBe(429);
    expect(res.body).toEqual({ error: 'Too many chat requests, please try again later.' });
  });

  it('should include rate limit headers', async () => {
    const app = buildApp(2);

    const res = await request(app).post('/api/chat').send({ message: 'hello' });

    expect(res.headers['ratelimit-policy']).toContain('2');
    expect(res.headers['ratelimit']).toContain('r=1');
  });
});
