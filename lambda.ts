import serverless from '@codegenie/serverless-express';
import { app } from './index.js';

const serverlessHandler = serverless({ app });

export const handler = async (event: any, context: any) => {
  return serverlessHandler(event, context);
};
