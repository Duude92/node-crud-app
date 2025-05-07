import { createServer } from 'node:http';
import { handleRoute } from './endpointRouter';
import { EndpointFunctionPair } from './endpointFunctionPair';

export const startServer = (port: number, endpoints: EndpointFunctionPair) => {
  const server = createServer({}, (req, res) => {
    handleRoute(req, res, endpoints);
  });
  server.listen(port, () => {
    console.log(`Endpoint server listening on port: ${port}`);
  });
};