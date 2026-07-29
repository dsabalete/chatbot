# Chatbot Personal

Personal assistant chatbot that provides information about professional background, including CV, experience, projects, technologies, and contact information.

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### API Documentation

Swagger UI available at `http://localhost:3000/docs`

## Project Structure

```
├── src/
│   ├── config/           # Environment and configuration
│   ├── types/            # TypeScript interfaces
│   ├── services/         # Business logic
│   │   ├── chat.service.ts
│   │   └── cv.service.ts
│   ├── controllers/      # Request handlers
│   │   ├── chat.controller.ts
│   │   └── cv.controller.ts
│   ├── routes/           # API routes
│   │   ├── index.ts
│   │   └── chat.routes.ts
│   ├── app.ts            # Express app setup
│   └── server.ts         # Local server entry
├── lambda.ts             # AWS Lambda entry
├── docs/
│   ├── openapi.yaml      # API specification
│   └── cv.md             # CV data source
└── types.d.ts            # External type declarations
```

## Architecture

- **Services**: Pure business logic, no HTTP concerns
- **Controllers**: Handle HTTP request/response
- **Routes**: Define API endpoints and middleware
- **Config**: Centralized environment configuration

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/about` | Professional summary |
| GET | `/experience` | Work experience |
| POST | `/api/chat` | Send message to chatbot |
| GET | `/api/chat/history` | Get conversation history |
| DELETE | `/api/chat/history` | Clear conversation history |

## Lambda Deployment

The app uses `@codegenie/serverless-express` to run on AWS Lambda.

Entry point: `lambda.ts`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production server |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
