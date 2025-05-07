import { startServer } from './endpointService/serverStartup';
import dotenv from 'dotenv';
import { controller } from './endpointService/controllers/usersController';
import { initDbService } from './dbService/init';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';

if (cluster.isPrimary) {
  const parallelism = availableParallelism();
  dotenv.config();
  initDbService(+(process.env.DB_PORT || 5050));
// Default behaviour is 3000 port
  for (let i = 0; i < parallelism; i++) {
    cluster.fork({ SERVER_APP_ID: i });
  }

} else {
  const workerId = +(process.env.SERVER_APP_ID ?? 0) + 1;
  startServer(+(process.env.APP_PORT || 3000) + workerId, controller);
}
