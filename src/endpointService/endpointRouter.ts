import { IncomingMessage, ServerResponse } from 'node:http';
import { ApiController } from '../shared/endpointFunctionPair';
import { requestBody } from './bodyRequestUtil';

function sendEmptyError(res: ServerResponse<IncomingMessage>) {
  sendResponse(res, 500, 'Internal Server Error');
}

function sendResponse(res: ServerResponse<IncomingMessage>, code: number, message: string) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(message);
}

export const handleRoute = async (request: IncomingMessage, response: ServerResponse<IncomingMessage>, controller: ApiController) => {
  try {
    const method = request.method;
    const reqPath = (request.url as string).split('/');
    reqPath.shift();
    const pathApi = reqPath.shift();
    const controllerPath = reqPath.shift() as string;
    const endpoints = controller[`${pathApi}/${controllerPath}`];
    if (!endpoints) {
      sendResponse(response, 404, 'Requested resource is not found.');
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
    if (!fn) {
      sendResponse(response, 405, 'Method Not Allowed');
      return;
    }
    const parameters: any[] = [];
    if (id)
      parameters.push(id);
    if (parameter)
      parameters.push(parameter);
    const result = await fn(response, ...parameters);
    if (!result) {
      sendEmptyError(response);
    }
  } catch (error) {
    sendEmptyError(response);
  }
};