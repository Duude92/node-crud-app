import { IncomingMessage, ServerResponse } from 'node:http';

// export type EndpointFunctionPair = { [id: string]: (some: string) => Promise<IUser> };
export type EndpointFunctionPair = {
  [id: string]: (response: ServerResponse<IncomingMessage>, ...parameter: any[]) => void
};