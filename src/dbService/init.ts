import { startServer } from '../endpointService/serverStartup';
import { controller } from './controllers/usersController';

export const initDbService = (dbPort: number) => {
  startServer(dbPort, controller);
};