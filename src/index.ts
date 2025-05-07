import {startServer} from "./endpointService/serverStartup";
import dotenv from "dotenv";
import {endpoints} from "./endpointService/controllers/usersController";

dotenv.config();

console.log(process.env.APP_PORT);
// Default behaviour is 3000 port
startServer(+(process.env.APP_PORT || 3000), endpoints);
