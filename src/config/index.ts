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
};
