import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import openapiYaml from '../docs/openapi.yaml';
import routes from './routes/index.js';

const app = express();

const swaggerDocument = YAML.parse(openapiYaml);

app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(routes);

export default app;
