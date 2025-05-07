import { IncomingMessage, ServerResponse } from 'node:http';
import { ApiController } from '../shared/endpointFunctionPair';
import { requestBody } from './bodyRequestUtil';
import { IUser } from '../shared/models/userModel';

export const handleRoute = async (request: IncomingMessage, response: ServerResponse<IncomingMessage>, controller: ApiController) => {
  try {
    const method = request.method;
    const reqPath = (request.url as string).split('/');
    reqPath.shift();
    const pathApi = reqPath.shift();
    const controllerPath = reqPath.shift() as string;
    const endpoints = controller[`${pathApi}/${controllerPath}`];
    if (!endpoints) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end(`Requested resource is not found.`);
      return;
    }
    const id = reqPath.shift() as string;
    let parameter: any;
    const endpoint = `${method}${id ? '/id' : ''}`;
    // Probably could request body anyway and check if object is exist
    if (method === 'POST' || method === 'PUT') {
      parameter = await requestBody(request);
    }
    // Should contain METHOD{/?{parameter?}}
    const fn = endpoints[endpoint];
    const parameters: any[] = [];
    if (id)
      parameters.push(id);
    if (parameter)
      parameters.push(parameter);
    await fn(response, ...parameters);
  } catch (error) {
    console.error(error);
  }
};