import { IUser } from '../../shared/models/userModel';
import { ServerResponse } from 'node:http';
import { controller } from './usersController';
import { getUserStorage } from '../storage';
import { randomUUID } from 'node:crypto';

const myUsers: Array<IUser> = [
  { id: '93d898f7-cdab-422a-9778-a0eaa1146350', age: 21, hobbies: ['programming', 'swimming'], username: 'Admin' },
  { id: '39d5a587-f1f9-41cf-a323-6719587d3b00', age: 24, hobbies: ['espionage'], username: 'AnonymousMan' }
];
const contentType = { 'Content-Type': 'application/json' };
const originalResponse = jest.requireActual('node:http');
const response: ServerResponse = {
  ...originalResponse,
  writeHead: jest.fn(),
  end: jest.fn()
};
const additionalUserId = '16aafaa5-7cb4-45f7-ac64-784d1ad3e533';
const additionalUser = { age: 33, hobbies: ['estudiar español'], username: 'Señor tomato' };

jest.mock('../storage', () => ({
  getUserStorage: jest.fn()
}));
jest.mock('node:crypto', () => ({
  randomUUID: jest.fn()
}));

describe('DB Users controller CRUD tests', () => {
    const controllerString = 'api/users';
    const controllerMethods = controller[controllerString];
    const getUsersMethod = controllerMethods['GET'];
    const getUserMethod = controllerMethods['GET/id'];
    const postUserMethod = controllerMethods['POST'];
    const putUserMethod = controllerMethods['PUT/id'];
    const deleteUserMethod = controllerMethods['DELETE/id'];
    beforeEach(() => {
      (getUserStorage as jest.Mock).mockImplementation(jest.fn(() => ({ data: myUsers })));
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('Should get all myUsers', async () => {
      await expect(getUsersMethod(response)).resolves.toBeTruthy();
      expect(response.writeHead).toHaveBeenCalledWith(200, contentType);
      expect(response.end).toHaveBeenCalledWith(JSON.stringify(myUsers));
    });
    test('Should get user by id', async () => {
      await expect(getUserMethod(response, myUsers[0].id)).resolves.toBeTruthy();
      expect(response.writeHead).toHaveBeenCalledWith(200, contentType);
      expect(response.end).toHaveBeenCalledWith(JSON.stringify(myUsers[0]));
    });
    test('Should fail with 404 error', async () => {
      const id = '93d898f7-cdab-422a-9778-a0eaa1146351';
      await expect(getUserMethod(response, id)).resolves.toBeTruthy();
      expect(response.writeHead).toHaveBeenCalledWith(404, contentType);
      expect(response.end).toHaveBeenCalledWith(`User with id ${id} not found.`);
    });
    test('Should post user', async () => {
      const newUser = { ...additionalUser, id: additionalUserId };
      (randomUUID as jest.Mock).mockImplementation(jest.fn(() => additionalUserId));
      await expect(postUserMethod(response, additionalUser)).resolves.toBeTruthy();
      expect(response.writeHead).toHaveBeenCalledWith(201, contentType);
      expect(response.end).toHaveBeenCalledWith(JSON.stringify(newUser));
    });
    test('Should update user', async () => {
      const initialId = '93d898f7-cdab-422a-9778-a0eaa1146350';
      const updatedUser = { ...additionalUser, id: initialId };
      await putUserMethod(response, initialId, additionalUser);
      expect(response.writeHead).toHaveBeenCalledWith(200, contentType);
      expect(response.end).toHaveBeenCalledWith(JSON.stringify(updatedUser));
    });
    test('Should remove second myUsers item', async () => {
      const resultArray = [...myUsers];
      resultArray.splice(0, 1);
      await deleteUserMethod(response, myUsers[1].id);
      expect(response.writeHead).toHaveBeenCalledWith(204, contentType);
      expect(response.end).toHaveBeenCalledWith('User deleted successfully.');
    });
  }
);