import { IncomingMessage, ServerResponse } from 'node:http';
import { EndpointFunctionPair } from './endpointFunctionPair';
import { requestBody } from './bodyRequestUtil';
import { IUser } from '../shared/models/userModel';

export const handleRoute = async (request: IncomingMessage, response: ServerResponse<IncomingMessage>, endpoints: EndpointFunctionPair) => {
  try {
    const method = request.method;
    const reqPath = (request.url as string).split('/');
    reqPath.shift();
    const pathApi = reqPath.shift();
    const controllerPath = reqPath.shift() as string;
    let parameter: any;
    let endpoint: string;
    if (method === 'POST') {
      parameter = await requestBody(request);
      endpoint = `${method}${parameter.id ? '/id' : ''}`;
    } else {
      parameter = /*method === 'POST' ? request.body : */reqPath.shift() as string;
      endpoint = `${method}${parameter ? '/id' : ''}`;
    }
    // Should contain METHOD{/?{parameter?}}
    const fn = endpoints[endpoint];
    fn(response, parameter);
  }
  catch (error) {
    console.error(error);
  }
};