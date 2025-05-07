import { startServer } from './endpointService/serverStartup';
import dotenv from 'dotenv';
import { controller } from './endpointService/controllers/usersController';

dotenv.config();

// Default behaviour is 3000 port
startServer(+(process.env.APP_PORT || 3000), controller);
