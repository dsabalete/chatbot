export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConversationMessage {
  conversationId: string;
  timestamp: number;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface BedrockMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface BedrockRequest {
  messages: BedrockMessage[];
  max_tokens: number;
  temperature: number;
  anthropic_version: string;
  system?: string;
}

export interface BedrockResponse {
  content: Array<{ type: string; text: string }>;
  stop_reason: string;
}

export interface ChatResponse {
  response: string;
  conversationHistory: Message[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

export interface ErrorResponse {
  error: string;
}

export interface HistoryResponse {
  conversationHistory: Message[];
}

export interface MessageResponse {
  message: string;
}

export interface AboutResponse {
  name: string;
  title: string;
  location: string;
  summary: string;
  highlights: string[];
}

export interface WorkExperienceItem {
  role: string;
  company: string;
  period: string;
  achievements: string[];
}

export interface ExperienceResponse {
  experience: WorkExperienceItem[];
}
