import { requestBody } from './bodyRequestUtil';
import { IncomingMessage } from 'node:http';

describe('Test for bodyRequestUtil', () => {
  test('Should return a string from request stream', async () => {
    const message = ({
      [Symbol.iterator]: jest.fn(() => ['{', '"foo": "bar",', '"bar": "baz",', '"baz": "foo"', '}'].values())
    });

    await expect(requestBody(message as unknown as IncomingMessage)).resolves.toStrictEqual({
      'bar': 'baz',
      'baz': 'foo',
      'foo': 'bar'
    });
  });
});