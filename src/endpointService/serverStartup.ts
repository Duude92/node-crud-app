import { createServer } from 'node:http';
import { handleRoute } from './endpointRouter';
import { ApiController } from './endpointFunctionPair';

export const startServer = (port: number, controller: ApiController) => {
  const server = createServer({}, (req, res) => {
    handleRoute(req, res, controller);
  });
  server.listen(port, () => {
    console.log(`Endpoint server listening on port: ${port}`);
  });
};