import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { config } from '../config/index.js';
import { BedrockRequest, BedrockResponse } from '../types/index.js';

const client = new BedrockRuntimeClient({ region: config.bedrock.region });

const SYSTEM_PROMPT = `You are a helpful, friendly, and knowledgeable assistant. You provide concise and accurate responses. 
If you don't know something, you say so honestly. You can help with general questions, coding, writing, analysis, and more.
Keep your responses focused and relevant to the user's question.`;

export async function invokeClaude(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const request: BedrockRequest = {
    messages,
    max_tokens: config.bedrock.maxTokens,
    temperature: 0.7,
    anthropic_version: 'bedrock-2023-05-31',
    system: SYSTEM_PROMPT,
  };

  const command = new InvokeModelCommand({
    modelId: config.bedrock.modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(request),
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body)) as BedrockResponse;

  return responseBody.content[0].text;
}
