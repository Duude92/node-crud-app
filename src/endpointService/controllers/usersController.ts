import { IUser } from '../../shared/models/userModel';
import { ServerResponse, IncomingMessage } from 'node:http';
import { EndpointFunctionPair } from '../endpointFunctionPair';
import { randomUUID } from 'node:crypto';

const users: Array<IUser> = [
  { id: '1', age: 2, hobbies: ['aboba'], username: 'name' } as IUser,
  { id: '12', age: 23, hobbies: ['aboba1'], username: 'nam1e' } as IUser
];


const getUsers = async (res: ServerResponse<IncomingMessage>): Promise<void> => {
  // await provider get users
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

const getUser = async (res: ServerResponse<IncomingMessage>, id: string): Promise<void> => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users.find(x => x.id === id)));
};

const postUser = async (res: ServerResponse<IncomingMessage>, body: IUser): Promise<void> => {
  body.id = randomUUID().toString();
  users.push(body);
  res.writeHead(200, { 'Content-Type': 'application/json' });
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
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('User deleted successfully.');
  } catch {
    return;
  }
};

const putUser = async (res: ServerResponse<IncomingMessage>, id: string, body: IUser): Promise<void> => {
  try {
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

export const endpoints: EndpointFunctionPair = {
  'GET': getUsers,
  'GET/id': getUser,
  'POST': postUser,
  'DELETE/id': deleteUser,
  'PUT/id': putUser
};