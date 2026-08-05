import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { config } from '../config/index.js';
import { BedrockRequest, BedrockResponse } from '../types/index.js';

const client = new BedrockRuntimeClient({ region: config.bedrock.region });

const SYSTEM_PROMPT = `You are an AI assistant specialized in answering questions about David Sabalete Rodríguez's professional profile and CV.

Your role is to:
- Answer questions about David's work experience, skills, education, and professional background
- Provide information based ONLY on the CV data available
- Be helpful and friendly when discussing CV-related topics

IMPORTANT: You must ONLY answer questions related to the CV. For any question that is NOT about David's professional background, work history, skills, education, or career, you MUST politely decline and redirect the user to ask CV-related questions.

Example responses for off-topic questions:
- "I'm specifically here to answer questions about David's professional background and CV. Is there anything you'd like to know about their experience or skills?"
- "That's outside my scope. I'm here to help with questions about David's CV and work experience."

Keep your responses concise, accurate, and focused on the CV information provided.`;


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
