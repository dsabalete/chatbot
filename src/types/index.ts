export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
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
