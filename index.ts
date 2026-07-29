import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import serverless from '@codegenie/serverless-express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

interface AboutResponse {
  name: string;
  title: string;
  location: string;
  summary: string;
  highlights: string[];
}

interface WorkExperienceItem {
  role: string;
  company: string;
  period: string;
  achievements: string[];
}

interface ExperienceResponse {
  experience: WorkExperienceItem[];
}

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = YAML.load("./docs/openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let conversationHistory: Message[] = [];

app.use(cors());
app.use(express.json());

function parseProfessionalSummary(): AboutResponse {
  const cvPath = path.join(__dirname, 'docs', 'cv.md');
  const cvContent = fs.readFileSync(cvPath, 'utf-8');

  const lines = cvContent.split('\n');
  let inSummary = false;
  const summaryLines: string[] = [];
  let name = 'David Sabalete Rodríguez';
  let title = 'Senior Full Stack Developer';
  let location = 'Barcelona, Spain · Remote';

  for (const line of lines) {
    if (line.startsWith('# ')) {
      name = line.replace('# ', '').trim();
      continue;
    }
    if (line.startsWith('**') && line.includes('|')) {
      const parts = line.split('|');
      if (parts[0].includes('Senior')) {
        title = parts[0].replace(/\*\*/g, '').trim();
        location = parts[1].trim();
      }
      continue;
    }
    if (line === '## Professional Summary') {
      inSummary = true;
      continue;
    }
    if (inSummary && line.startsWith('## ')) {
      break;
    }
    if (inSummary && line.trim() && line !== '---') {
      summaryLines.push(line.trim());
    }
  }

  const highlights = summaryLines
    .filter(l => l.length > 0)
    .map(l => l.replace(/^\d+\.\s*/, ''));

  return {
    name,
    title,
    location,
    summary: summaryLines.join(' '),
    highlights
  };
}

function parseWorkExperience(): ExperienceResponse {
  const cvPath = path.join(__dirname, 'docs', 'cv.md');
  const cvContent = fs.readFileSync(cvPath, 'utf-8');

  const lines = cvContent.split('\n');
  let inExperience = false;
  const experiences: WorkExperienceItem[] = [];
  let currentExp: Partial<WorkExperienceItem> = {};
  let inDescription = false;

  for (const line of lines) {
    if (line === '## Work Experience') {
      inExperience = true;
      continue;
    }
    if (inExperience && line.startsWith('## ')) {
      break;
    }
    if (!inExperience) continue;

    if (line.startsWith('### ')) {
      if (currentExp.role && currentExp.company) {
        experiences.push(currentExp as WorkExperienceItem);
      }
      currentExp = {
        role: line.replace('### ', '').trim(),
        company: '',
        period: '',
        achievements: []
      };
      inDescription = false;
      continue;
    }

    if (line.includes('**') && (line.includes('—') || line.includes('–'))) {
      const cleanLine = line.replace(/\*\*/g, '');
      const dashIndex = cleanLine.search(/[—–]/);
      currentExp.company = cleanLine.slice(0, dashIndex).trim();
      currentExp.period = cleanLine.slice(dashIndex + 1).trim();
      inDescription = true;
      continue;
    }

    if (inDescription && line.startsWith('- ')) {
      currentExp.achievements?.push(line.replace('- ', '').trim());
      continue;
    }
  }

  if (currentExp.role && currentExp.company) {
    experiences.push(currentExp as WorkExperienceItem);
  }

  return { experience: experiences };
}

app.get('/health', (_req: Request, res: Response<HealthResponse>) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/about', (_req: Request, res: Response<AboutResponse>) => {
  const about = parseProfessionalSummary();
  res.json(about);
});

app.get('/experience', (_req: Request, res: Response<ExperienceResponse>) => {
  const experience = parseWorkExperience();
  res.json(experience);
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

const serverlessHandler = serverless({ app });

export const handler = async (event: any, context: any) => {
  return serverlessHandler(event, context);
};

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Chatbot server running on http://localhost:${PORT}`);
  });
}