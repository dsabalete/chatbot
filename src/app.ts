import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { config } from './config/index.js';
import routes from './routes/index.js';

const app = express();

const swaggerDocument = YAML.load(path.join(config.paths.docs, 'openapi.yaml'));

app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(routes);

export default app;
