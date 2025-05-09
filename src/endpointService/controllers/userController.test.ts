import { IUser } from '../../shared/models/userModel';
import { getUsers } from '../../providers/userStorageProvider';
import { controller } from './usersController';
import { ServerResponse } from 'node:http';

const users: Array<IUser> = [
  { id: '93d898f7-cdab-422a-9778-a0eaa1146350', age: 20, hobbies: ['programming', 'swimming'], username: 'Admin' },
  { id: '39d5a587-f1f9-41cf-a323-6719587d3b00', age: 23, hobbies: ['espionage'], username: 'AnonymousMan' }
];
const contentType = { 'Content-Type': 'application/json' };
const originalResponse = jest.requireActual('node:http');
const response: ServerResponse = {
  ...originalResponse,
  writeHead: jest.fn(),
  end: jest.fn()
};

jest.mock('../../providers/userStorageProvider', () => ({
  getUsers: jest.fn(async () => {
    return {
      ok: true,
      json: jest.fn()
    };
  })
}));
describe('Users controller CRUD tests', () => {
    const controllerString = 'api/users';
    const controllerMethods =  controller[controllerString];
    const getUsersMethod = controllerMethods['GET'];
    test('Should get all users', async () => {
      (getUsers as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => (users) });
      await getUsersMethod(response);
      expect(response.writeHead).toHaveBeenCalledWith(200, contentType);
      expect(response.end).toHaveBeenCalledWith(JSON.stringify(users));
    });
  }
);