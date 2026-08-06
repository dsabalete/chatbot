import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import openapiContent from "../docs/openapi.yaml";
import routes from './routes/index.js';
import { globalLimiter, chatLimiter } from './middleware/rateLimiter.js';

const app = express();

const swaggerDocument = YAML.parse(openapiContent);

app.use(cors());
app.use(express.json());
app.use(globalLimiter);

// AWS_LAMBDA_FUNCTION_NAME is only set in real Lambda, not in SAM local
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use('/api/chat', chatLimiter);
app.use(routes);

export default app;
