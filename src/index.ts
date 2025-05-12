import { startServer } from './endpointService/serverStartup';
import dotenv from 'dotenv';
import { controller } from './endpointService/controllers/usersController';
import { initDbService } from './dbService/init';
import { setDbUrl } from './providers/userStorageProvider';

dotenv.config();
const endpointPort = parseInt(process.env.APP_PORT || '') || 3000;
const dbServerPort = parseInt(process.env.DB_PORT || '') || 5050;
setDbUrl(`http://localhost:${dbServerPort}`);
initDbService(dbServerPort);
// Default behaviour is 3000 port
startServer(endpointPort, controller);
