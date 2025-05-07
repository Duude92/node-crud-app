import { isValidUser, IUser } from '../../shared/models/userModel';
import { ServerResponse, IncomingMessage } from 'node:http';
import { ApiController } from '../../shared/endpointFunctionPair';
import { randomUUID } from 'node:crypto';

const users: Array<IUser> = [
  { id: '93d898f7-cdab-422a-9778-a0eaa1146350', age: 20, hobbies: ['programming', 'swimming'], username: 'Admin' },
  { id: '39d5a587-f1f9-41cf-a323-6719587d3b00', age: 23, hobbies: ['espionage'], username: 'AnonymousMan' }
];

const getUsers = async (res: ServerResponse<IncomingMessage>): Promise<void> => {
  // await provider get users
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};
const getUser = async (res: ServerResponse<IncomingMessage>, id: string): Promise<void> => {
  const user = users.find(x => x.id === id);
  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end();
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
};
const validateUser = (body: IUser, res: ServerResponse<IncomingMessage>) => {
  const valid = isValidUser(body);
  if (!valid) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end();
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

    const user = findUser(id, res);
    const userIdx = users.indexOf(user);

    users.splice(userIdx, 1);
    res.writeHead(204, { 'Content-Type': 'application/json' });
    res.end('User deleted successfully.');
  } catch {
    return;
  }
};

const putUser = async (res: ServerResponse<IncomingMessage>, id: string, body: IUser): Promise<void> => {
  try {
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