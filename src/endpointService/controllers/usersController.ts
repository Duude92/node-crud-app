import { isValidUser, IUser } from '../../shared/models/userModel';
import { ServerResponse, IncomingMessage } from 'node:http';
import { ApiController } from '../../shared/endpointFunctionPair';
import * as storageProvider from '../../providers/userStorageProvider';

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const contentType = { 'Content-Type': 'application/json' };

function sendEmptyError(res: ServerResponse<IncomingMessage>, result: Response) {
  res.writeHead(result.status, contentType);
  res.end();
}

const getUsers = async (res: ServerResponse<IncomingMessage>): Promise<void> => {
  // await provider get users
  const result = await storageProvider.getUsers();
  if (result.ok) {
    const users = await result.json() as IUser[];
    res.writeHead(200, contentType);
    res.end(JSON.stringify(users));
    return;
  }
  sendEmptyError(res, result);
};
const validateUUID = (id: string, res: ServerResponse<IncomingMessage>) => {
  if (!uuidRegex.test(id)) {
    res.writeHead(400, contentType);
    res.end(`User id "${id}" is not valid UUIDv4 record.`);
    const error = new Error(`Invalid UUID: ${id}`);
    error.name = 'EINUUID';
    throw error;
  }
};
const getUser = async (res: ServerResponse<IncomingMessage>, id: string): Promise<void> => {
  validateUUID(id, res);
  const result = await storageProvider.getUser(id);
  if (result.ok) {
    const user = await result.json() as IUser;
    res.writeHead(200, contentType);
    res.end(JSON.stringify(user));
    return;
  }

  if (result.status === 404) {
    responseNotFound(res, id);
  }
  sendEmptyError(res, result);

};
const validateUser = (body: IUser, res: ServerResponse<IncomingMessage>) => {
  const valid = isValidUser(body);
  if (!valid) {
    res.writeHead(400, contentType);
    res.end(`Object missing required fields.
Valid keys are:
username: string;
age: number;
hobbies: string[];`);
    const error = new Error(`Invalid User parameters: ${body}`);
    error.name = 'EINBODY';
    throw error;
  }
};
const postUser = async (res: ServerResponse<IncomingMessage>, body: IUser): Promise<void> => {
  validateUser(body, res);
  const result = await storageProvider.postUser(body);
  if (result.ok) {
    const user = await result.json() as IUser;
    res.writeHead(201, contentType);
    res.end(JSON.stringify(user));
    return;
  }
};

const responseNotFound = (res: ServerResponse<IncomingMessage>, id: string) => {
  res.writeHead(404, contentType);
  res.end(`User with id ${id} not found.`);
};

const deleteUser = async (res: ServerResponse<IncomingMessage>, id: string): Promise<void> => {
  validateUUID(id, res);
  const result = await storageProvider.deleteUser(id);
  if (result.ok) {
    res.writeHead(204, contentType);
    res.end('User deleted successfully.');
    return;
  }
  if (result.status === 404) {
    responseNotFound(res, id);
    return;
  }
};

const putUser = async (res: ServerResponse<IncomingMessage>, id: string, body: IUser): Promise<void> => {
  validateUUID(id, res);
  validateUser(body, res);
  const result = await storageProvider.putUser(id, body);
  if (result.ok) {
    const user = await result.json() as IUser;
    res.writeHead(200, contentType);
    res.end(JSON.stringify(user));
    return;
  }
  if (result.status === 404) {
    responseNotFound(res, id);
    return;
  }
};

export const controller: ApiController = {
  'api/users': {
    'GET': getUsers,
    'GET/id': getUser,
    'POST': postUser,
    'DELETE/id': deleteUser,
    'PUT/id': putUser
  }
};