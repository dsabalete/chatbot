declare module '*.yaml' {
  const content: string;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}

declare module '@codegenie/serverless-express' {
  import { Express } from 'express';

  interface ServerlessOptions {
    app: Express;
  }

  interface ServerlessHandler {
    (event: any, context: any): Promise<any>;
  }

  function serverless(options: ServerlessOptions): ServerlessHandler;

  export default serverless;
}
