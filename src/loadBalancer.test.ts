import cluster from 'node:cluster';
import * as lb from './loadBalancer';
import { initDbService } from './dbService/init';

jest.mock('node:cluster', () => ({
  fork: jest.fn(),
  isPrimary: true
}));
jest.mock('./endpointService/serverStartup', () => ({
  startServer: jest.fn()
}));
jest.mock('node:http', () => ({
  createServer: jest.fn(() => ({
    listen: jest.fn()
  }))
}));
jest.mock('./dbService/init', () => ({
  initDbService: jest.fn()
}));
jest.mock('node:os', () => ({
  availableParallelism: jest.fn(() => 3)
}));

describe('Test for load balancer initialization', () => {
  test('This should test startup isPrimary === true', async () => {
    lb.startCluster();
    expect(initDbService).toHaveBeenCalledTimes(1);
    expect(cluster.fork).toHaveBeenCalledTimes(2);
  });
});