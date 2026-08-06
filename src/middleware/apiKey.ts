import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { config } from '../config/index.js';
import type { Request, Response, NextFunction } from 'express';

const secretsManager = new SecretsManagerClient({ region: config.bedrock.region });

let cachedApiKey: string | null = null;
let cacheLoaded = false;

async function resolveApiKey(): Promise<string | null> {
  if (cacheLoaded) {
    return cachedApiKey;
  }

  if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
    cachedApiKey = config.apiKey || null;
  } else if (config.apiKeySecretArn) {
    const command = new GetSecretValueCommand({ SecretId: config.apiKeySecretArn });
    const response = await secretsManager.send(command);
    const secret = response.SecretString ? JSON.parse(response.SecretString) : {};
    cachedApiKey = secret.apiKey || null;
  }

  cacheLoaded = true;
  return cachedApiKey;
}

export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  resolveApiKey()
    .then((apiKey) => {
      if (!apiKey) {
        return next();
      }

      const provided = req.header('X-API-Key');
      if (provided && provided === apiKey) {
        return next();
      }

      res.status(401).json({ error: 'Invalid or missing API key.' });
    })
    .catch(() => {
      res.status(503).json({ error: 'Unable to load API key.' });
    });
}
