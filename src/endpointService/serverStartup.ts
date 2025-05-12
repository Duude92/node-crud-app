import { createServer } from 'node:http';
import { handleRoute } from './endpointRouter';
import { ApiController } from '../shared/endpointFunctionPair';

export const startServer = (port: number, controller: ApiController) => {
  const server = createServer({}, async (req, res) => {
    await handleRoute(req, res, controller);
  });
  server.listen(port, () => {
    console.log(`HTTP server listening on port: ${port}`);
  });
};