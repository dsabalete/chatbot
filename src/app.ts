import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import routes from './routes/index.js';

const app = express();

const openapiPath = resolve(process.cwd(), "docs/openapi.yaml");
const openapiDocument = readFileSync(openapiPath, "utf8");
const swaggerDocument = YAML.parse(openapiDocument);

app.use(cors());
app.use(express.json());

// AWS_LAMBDA_FUNCTION_NAME is only set in real Lambda, not in SAM local
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(routes);

export default app;
