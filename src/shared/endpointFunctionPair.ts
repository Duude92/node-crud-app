import { IncomingMessage, ServerResponse } from 'node:http';

// export type EndpointFunctionPair = { [id: string]: (some: string) => Promise<IUser> };
type EndpointFunctionPair = {
  [id: string]: (response: ServerResponse<IncomingMessage>, ...parameter: any[]) => Promise<boolean>
};
export type ApiController = {
  [path: string]: EndpointFunctionPair;
}