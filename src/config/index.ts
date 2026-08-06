import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  bedrock: {
    modelId: process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
    region: process.env.AWS_REGION || 'us-east-1',
    maxTokens: parseInt(process.env.BEDROCK_MAX_TOKENS || '1024'),
  },
  dynamodb: {
    tableName: process.env.DYNAMODB_TABLE_NAME || 'chatbot-conversations',
    region: process.env.AWS_REGION || 'us-east-1',
  },
  rateLimit: {
    globalWindowMs: parseInt(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS || '900000'),
    globalMax: parseInt(process.env.RATE_LIMIT_GLOBAL_MAX || '100'),
    chatWindowMs: parseInt(process.env.RATE_LIMIT_CHAT_WINDOW_MS || '60000'),
    chatMax: parseInt(process.env.RATE_LIMIT_CHAT_MAX || '20'),
  },
  apiKey: process.env.API_KEY || '',
  apiKeySecretArn: process.env.API_KEY_SECRET_ARN || '',
};
