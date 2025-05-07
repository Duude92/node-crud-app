import { startServer } from './endpointService/serverStartup';
import dotenv from 'dotenv';
import { controller } from './endpointService/controllers/usersController';
import { initDbService } from './dbService/init';

dotenv.config();

initDbService(+(process.env.DB_PORT || 5050));
// Default behaviour is 3000 port
startServer(+(process.env.APP_PORT || 3000), controller);
