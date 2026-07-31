import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const openapiYaml = readFileSync(resolve(__dirname, '../docs/openapi.yaml'), 'utf8');
const swaggerDocument = YAML.parse(openapiYaml);

app.use(cors());
app.use(express.json());

// AWS_LAMBDA_FUNCTION_NAME is only set in real Lambda, not in SAM local
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(routes);

export default app;
