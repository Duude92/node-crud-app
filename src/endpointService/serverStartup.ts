import {createServer} from 'node:http'
import {EndpointFunctionPair} from "./controllers/usersController";

export const startServer = (port: number, endpoints: EndpointFunctionPair) => {
    const server = createServer({}, (req, res) => {
        const reqPath = (req.url as string).split('/');
        reqPath.shift();
        const pathApi = reqPath.shift();
        const controllerPath = reqPath.shift() as string;
        const parameter = reqPath.shift() as string;
        const endpoint = `${controllerPath}${parameter && '/id'}`;

        const fn = endpoints[endpoint];
        // 404
        if (!fn) {
            throw new Error(`Unable to find endpoint ${endpoint}`);
        }
        fn(res);
        // res.writeHead(200, {'Content-Type': 'text/plain'});
        // res.end();
    });
    server.listen(port, () => {
        console.log(`Endpoint server listening on port: ${port}`);
    });
}