import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  response: string;
  conversationHistory: Message[];
}

interface HealthResponse {
  status: string;
  timestamp: string;
}

interface ErrorResponse {
  error: string;
}

interface HistoryResponse {
  conversationHistory: Message[];
}

interface MessageResponse {
  message: string;
}

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = YAML.load("./docs/openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let conversationHistory: Message[] = [];

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response<HealthResponse>) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/chat', (req: Request<{}, ChatResponse | ErrorResponse, ChatRequest>, res: Response<ChatResponse | ErrorResponse>) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  conversationHistory.push({ role: 'user', content: message });

  const botResponse = generateResponse(message, conversationHistory);
  conversationHistory.push({ role: 'assistant', content: botResponse });

  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-20);
  }

  res.json({
    response: botResponse,
    conversationHistory: conversationHistory.slice(-10)
  });
});

app.get('/api/chat/history', (_req: Request, res: Response<HistoryResponse>) => {
  res.json({ conversationHistory });
});

app.delete('/api/chat/history', (_req: Request, res: Response<MessageResponse>) => {
  conversationHistory = [];
  res.json({ message: 'History cleared' });
});

function generateResponse(message: string, history: Message[]): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! How can I help you today?';
  }

  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return 'Goodbye! Have a great day!';
  }

  if (lowerMessage.includes('help')) {
    return 'I can help you with basic questions. Try saying hello, asking how I am, or saying goodbye!';
  }

  if (lowerMessage.includes('how are you')) {
    return "I'm doing well, thank you for asking! How about you?";
  }

  if (lowerMessage.includes('name')) {
    return "I'm a simple chatbot. You can call me ChatBot!";
  }

  if (lowerMessage.includes('weather')) {
    return "I don't have access to weather data, but I hope it's nice where you are!";
  }

  if (lowerMessage.includes('time')) {
    return `The current time is ${new Date().toLocaleTimeString()}.`;
  }

  if (lowerMessage.includes('date')) {
    return `Today is ${new Date().toLocaleDateString()}.`;
  }

  if (lowerMessage.includes('joke')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised!",
      "Why don't eggs tell jokes? They'd crack each other up!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  const responses = [
    "That's interesting! Tell me more.",
    "I see. What else would you like to talk about?",
    "Hmm, I'm not sure I understand. Could you rephrase that?",
    "That's a good point! What do you think about it?",
    "Interesting perspective! Anything else on your mind?"
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

app.listen(PORT, () => {
  console.log(`Chatbot server running on http://localhost:${PORT}`);
});