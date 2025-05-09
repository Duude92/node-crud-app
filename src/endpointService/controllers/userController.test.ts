import { IUser } from '../../shared/models/userModel';
import { getUser, getUsers } from '../../providers/userStorageProvider';
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
  }),
  getUser: jest.fn(async () => {

  })
}));
describe('Users controller CRUD tests', () => {
    const controllerString = 'api/users';
    const controllerMethods = controller[controllerString];
    const getUsersMethod = controllerMethods['GET'];
    const getUserMethod = controllerMethods['GET/id'];
    test('Should get all users', async () => {
      (getUsers as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => (users) });
      await getUsersMethod(response);
      expect(response.writeHead).toHaveBeenCalledWith(200, contentType);
      expect(response.end).toHaveBeenCalledWith(JSON.stringify(users));
    });
    test('Should get users by id', async () => {
      (getUser as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => (users[0]) });
      await getUserMethod(response, users[0].id);
      expect(response.writeHead).toHaveBeenCalledWith(200, contentType);
      expect(response.end).toHaveBeenCalledWith(JSON.stringify(users[0]));
    });
    test('Should get 404', async () => {
      (getUser as jest.Mock).mockResolvedValueOnce({ ok: false, status: 404 });
      await getUserMethod(response, '93d898f7-cdab-422a-9778-a0eaa1146351');
      expect(response.writeHead).toHaveBeenCalledWith(404, contentType);
      expect(response.end).toHaveBeenCalledWith('User with id 93d898f7-cdab-422a-9778-a0eaa1146351 not found.');
    });
    test('Should answer with error 500', async () => {
      (getUser as jest.Mock).mockResolvedValueOnce({ ok: false, status: 403 });
      await getUserMethod(response, '93d898f7-cdab-422a-9778-a0eaa1146351');
      expect(response.writeHead).toHaveBeenCalledWith(500, contentType);
      expect(response.end).toHaveBeenCalledWith('Internal Server Error');
    });

    test('Should fail with EINUUID error', async () => {
      await expect(getUserMethod(response, 'abcdefg')).rejects.toThrow('Invalid UUID: abcdefg');
    });
  }
);