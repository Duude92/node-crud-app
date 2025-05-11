import { handleRoute } from './endpointRouter';
import { controller, getUser, postUser } from '../dbService/controllers/usersController';
import { IncomingMessage, ServerResponse } from 'node:http';
import { ApiController } from '../shared/endpointFunctionPair';

jest.mock('../dbService/controllers/usersController');//, () => ({
const originalResponse = jest.requireActual('node:http');
const response: ServerResponse = {
  ...originalResponse,
  writeHead: jest.fn(),
  end: jest.fn()
};
const contentType = { 'Content-Type': 'application/json' };


describe('Tests for endpoint router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  // test('This should test GET/id success route handling', async () => {
  //   const request: unknown = {
  //     method: 'GET',
  //     url: '/api/users/1'
  //   };
  //   (getUser as jest.Mock).mockResolvedValueOnce(true);
  //   await handleRoute(request as IncomingMessage, response as ServerResponse, controller);
  //   expect(getUser).toHaveBeenCalledWith(response as ServerResponse, '1');
  // });
  test('This should response response 404', async () => {
    const request: unknown = {
      method: 'GET',
      url: '/api/users/1'
    };
    await handleRoute(request as IncomingMessage, response as ServerResponse, [] as unknown as ApiController);
    expect(response.writeHead).toHaveBeenCalledWith(404, contentType);
    expect(response.end).toHaveBeenCalledWith('Requested resource is not found.');
  });
  test('This should test POST/id success route handling', async () => {
    const request: unknown = {
      method: 'POST',
      url: '/api/users',
      [Symbol.iterator]: jest.fn(() => ['{', '"foo": "bar",', '"bar": "baz",', '"baz": "foo"', '}'].values())
    };
    (postUser as jest.Mock).mockResolvedValueOnce(true);
    await handleRoute(request as IncomingMessage, response as ServerResponse, controller);
    expect(postUser).toHaveBeenCalledWith(response as ServerResponse, {
      'bar': 'baz',
      'baz': 'foo',
      'foo': 'bar'
    });
  });
  test('This should response response 500', async () => {
    const request: unknown = {
      method: 'GET',
      url: '/api/users/1'
    };
    (getUser as jest.Mock).mockResolvedValueOnce(false);
    await handleRoute(request as IncomingMessage, response as ServerResponse, controller);
    expect(response.writeHead).toHaveBeenCalledWith(500, contentType);
    expect(response.end).toHaveBeenCalledWith('Internal Server Error');
  });
});