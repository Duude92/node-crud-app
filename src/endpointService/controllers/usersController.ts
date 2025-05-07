import { IUser } from '../../shared/models/userModel';
import { ServerResponse, IncomingMessage } from 'node:http';
import { EndpointFunctionPair } from '../endpointFunctionPair';

const users: Array<IUser> = [
  { id: '1', age: 2, hobbies: ['aboba'], username: 'name' } as IUser,
  { id: '12', age: 23, hobbies: ['aboba1'], username: 'nam1e' } as IUser
];


const getUsers = async (res: ServerResponse<IncomingMessage>): Promise<void> => {
  // await provider get users
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

const getUser = async (res: ServerResponse<IncomingMessage>): Promise<void> => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users.find(x => x.id === '1')));
};
const postUser = async (res: ServerResponse<IncomingMessage>): Promise<void> => {

};

export const endpoints: EndpointFunctionPair = {
  'GET': getUsers,
  'GET/id': getUser
};