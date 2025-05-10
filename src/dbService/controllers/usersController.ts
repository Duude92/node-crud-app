import { isValidUser, IUser } from '../../shared/models/userModel';
import { ServerResponse, IncomingMessage } from 'node:http';
import { ApiController } from '../../shared/endpointFunctionPair';
import { randomUUID } from 'node:crypto';
import { getUserStorage } from '../storage';

const users = () => getUserStorage().data;

const getUsers = async (res: ServerResponse<IncomingMessage>): Promise<boolean> => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users()));
  return true;
};
const getUser = async (res: ServerResponse<IncomingMessage>, id: string): Promise<boolean> => {
  const user = users().find(x => x.id === id);
  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end();
    return true;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
  return true;
};
const postUser = async (res: ServerResponse<IncomingMessage>, body: IUser): Promise<boolean> => {
  body.id = randomUUID().toString();
  users().push(body);
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
  return true;
};

const findUser = (id: string, res: ServerResponse<IncomingMessage>): IUser => {
  const user = users().find(x => x.id === id);
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

const deleteUser = async (res: ServerResponse<IncomingMessage>, id: string): Promise<boolean> => {
  const user = findUser(id, res);
  const userIdx = users().indexOf(user);

  users().splice(userIdx, 1);
  res.writeHead(204, { 'Content-Type': 'application/json' });
  res.end('User deleted successfully.');
  return true;
};

const putUser = async (res: ServerResponse<IncomingMessage>, id: string, body: IUser): Promise<boolean> => {
  const user = findUser(id, res);
  const userIdx = users().indexOf(user);
  body.id = user.id;
  users()[userIdx] = body;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
  return true;
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