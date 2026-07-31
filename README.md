# Chatbot Personal

Personal assistant chatbot that provides information about professional background, including CV, experience, projects, technologies, and contact information.

## Quick Start

### Prerequisites

- Node.js 24+
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

## Production API

**Base URL:** `https://pnq6w5fer4.execute-api.us-east-1.amazonaws.com/Prod/`

| Endpoint   | Production URL                                                           |
| ---------- | ------------------------------------------------------------------------ |
| Health     | `https://pnq6w5fer4.execute-api.us-east-1.amazonaws.com/Prod/health`     |
| About      | `https://pnq6w5fer4.execute-api.us-east-1.amazonaws.com/Prod/about`      |
| Experience | `https://pnq6w5fer4.execute-api.us-east-1.amazonaws.com/Prod/experience` |
| Chat       | `https://pnq6w5fer4.execute-api.us-east-1.amazonaws.com/Prod/api/chat`   |
| Swagger UI | `https://pnq6w5fer4.execute-api.us-east-1.amazonaws.com/Prod/docs`       |

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
│   └── cv.md             # CV data source (inlined at build via esbuild)
└── types.d.ts            # External type declarations
```

## Architecture

- **Services**: Pure business logic, no HTTP concerns
- **Controllers**: Handle HTTP request/response
- **Routes**: Define API endpoints and middleware
- **Config**: Centralized environment configuration

## API Endpoints

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| GET    | `/health`           | Health check               |
| GET    | `/about`            | Professional summary       |
| GET    | `/experience`       | Work experience            |
| POST   | `/api/chat`         | Send message to chatbot    |
| GET    | `/api/chat/history` | Get conversation history   |
| DELETE | `/api/chat/history` | Clear conversation history |

## AWS Deployment (SAM)

### Prerequisites

- AWS CLI configured
- AWS SAM CLI installed

### Build & Deploy

```bash
# Build the application
sam build

# Deploy to AWS
sam deploy --guided

# Or deploy to a specific stack
sam deploy --stack-name chatbot-personal --capabilities CAPABILITY_IAM
```

### Local Testing with SAM

```bash
# Start local API Gateway
sam local start-api
```

### Stack Management

```bash
# View stack events
sam list stack-outputs --stack-name chatbot-personal

# Delete the stack
sam delete --stack-name chatbot-personal
```

## Lambda Deployment

The app uses `@codegenie/serverless-express` to run on AWS Lambda.

Entry point: `lambda.ts`

Static assets (`docs/openapi.yaml`, `docs/cv.md`) are inlined into the bundle at build time via esbuild loaders (`.yaml=text`, `.md=text`), so no separate file copying is needed.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Compile TypeScript       |
| `npm start`     | Run production server    |

## Environment Variables

| Variable   | Default       | Description      |
| ---------- | ------------- | ---------------- |
| `PORT`     | `3000`        | Server port      |
| `NODE_ENV` | `development` | Environment mode |

## Versioning

This project uses [semantic-release](https://semantic-release.gitbook.io/semantic-release/) for automatic versioning based on [conventional commits](https://www.conventionalcommits.org/).

### Commit Format

Use the following commit message format for automatic version bumps:

```
<type>[optional scope]: <description>
```

| Type              | Version bump | Example                                 |
| ----------------- | ------------ | --------------------------------------- |
| `feat`            | minor        | `feat: add new chat endpoint`           |
| `fix`             | patch        | `fix: correct health endpoint response` |
| `perf`            | patch        | `perf: optimize CV parsing`             |
| `refactor`        | patch        | `refactor: simplify config module`      |
| `docs`            | none         | `docs: update README`                   |
| `chore`           | none         | `chore: update dependencies`            |
| `BREAKING CHANGE` | major        | `feat!: drop Node.js 18 support`        |

### On Push to Main

1. Runs tests and type checking
2. Builds with SAM
3. Deploys to AWS
4. Automatically bumps version and creates GitHub Release

The version is visible in the `/health` endpoint response.
