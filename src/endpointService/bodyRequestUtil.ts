import { IncomingMessage } from 'node:http';

export async function requestBody<Type>(request: IncomingMessage): Promise<Type> {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
  }
  return JSON.parse(body) as Type;
}
