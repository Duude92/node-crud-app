import { IncomingMessage, ServerResponse } from 'node:http';
import { EndpointFunctionPair } from './endpointFunctionPair';

export const handleRoute = (request: IncomingMessage, response: ServerResponse<IncomingMessage>, endpoints: EndpointFunctionPair) => {
  const method = request.method;
  const reqPath = (request.url as string).split('/');
  reqPath.shift();
  const pathApi = reqPath.shift();
  const controllerPath = reqPath.shift() as string;
  const parameter = reqPath.shift() as string;
  // Should contain METHOD{/?{parameter?}}
  const endpoint = `${method}${parameter ? '/id' : ''}`;

  const fn = endpoints[endpoint];
  fn(response);
};