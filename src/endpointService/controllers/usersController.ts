import { isValidUser, IUser } from '../../shared/models/userModel';
import { ServerResponse, IncomingMessage } from 'node:http';
import { ApiController } from '../endpointFunctionPair';
import { randomUUID, UUID } from 'node:crypto';

const users: Array<IUser> = [
  { id: '1', age: 2, hobbies: ['aboba'], username: 'name' } as IUser,
  { id: '12', age: 23, hobbies: ['aboba1'], username: 'nam1e' } as IUser
];
const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const getUsers = async (res: ServerResponse<IncomingMessage>): Promise<void> => {
  // await provider get users
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};
const validateUUID = (id: string, res: ServerResponse<IncomingMessage>) => {
  if (!uuidRegex.test(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(`User id "${id}" is not valid UUIDv4 record.`);
    const error = new Error(`Invalid UUID: ${id}`);
    error.name = 'EINUUID';
    throw error;
  }
};
const getUser = async (res: ServerResponse<IncomingMessage>, id: string): Promise<void> => {
  try {
    validateUUID(id, res);
    const user = users.find(x => x.id === id);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(`Invalid User ID: ${id}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } catch {
    return;
  }
};
const validateUser = (body: IUser, res: ServerResponse<IncomingMessage>) => {
  const valid = isValidUser(body);
  if (!valid) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(`Object missing required fields.
Valid keys are:
username: string;
age: number;
hobbies: string[];`);
    return;
  }
};
const postUser = async (res: ServerResponse<IncomingMessage>, body: IUser): Promise<void> => {
  validateUser(body, res);
  body.id = randomUUID().toString();
  users.push(body);
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

const findUser = (id: string, res: ServerResponse<IncomingMessage>): IUser => {
  const user = users.find(x => x.id === id);
  if (!user) {
    responseNotFound(res, id);
    const error = new Error('User not found!');
    error.name = 'ENOTFOUND';
    throw error;
  }
  return user;
};

const responseNotFound = (res: ServerResponse<IncomingMessage>, id: string) => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(`User with id ${id} not found.`);
};

const deleteUser = async (res: ServerResponse<IncomingMessage>, id: string): Promise<void> => {
  try {
    validateUUID(id, res);

    const user = findUser(id, res);
    const userIdx = users.indexOf(user);

    users.splice(userIdx, 1);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('User deleted successfully.');
  } catch {
    return;
  }
};

const putUser = async (res: ServerResponse<IncomingMessage>, id: string, body: IUser): Promise<void> => {
  try {
    validateUUID(id, res);
    validateUser(body, res);

    const user = findUser(id, res);
    const userIdx = users.indexOf(user);

    body.id = user.id;
    users[userIdx] = body;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  } catch {
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