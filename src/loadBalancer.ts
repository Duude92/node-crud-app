import { startServer } from './endpointService/serverStartup';
import dotenv from 'dotenv';
import { controller } from './endpointService/controllers/usersController';
import { initDbService } from './dbService/init';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import http from 'node:http';

if (cluster.isPrimary) {
  const parallelism = availableParallelism() - 1;
  const balancerPort = +(process.env.APP_PORT || 3000);
  const appPortBase = balancerPort + 1;
  const appPorts: Array<number> = [];
  dotenv.config();
  initDbService(+(process.env.DB_PORT || 5050));
// Default behaviour is 3000 port

  let current = 0;
  const proxy = http.createServer((req, res) => {
    const targetPort = appPorts[current];
    const options: http.RequestOptions = {
      hostname: 'localhost',
      port: targetPort,
      path: req.url,
      method: req.method || 'GET',
      headers: req.headers
    };
    current = (++current) % parallelism;
    const proxyReq = http.request(options, (proxyRes) => {
      console.log(`Request routed to ${targetPort} server`);
      res.writeHead(proxyRes.statusCode as number, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });
    proxyReq.on('error', err => {
      console.error(`Error forwarding request to worker on port ${targetPort}:`, err);
      res.statusCode = 500;
      res.end('Internal error. Something went wrong');
    });
    req.pipe(proxyReq, { end: true });
  });
  proxy.listen(balancerPort, () => {
    console.log(`LB listening on port: ${balancerPort}`);
  });
  for (let i = 0; i < parallelism; i++) {
    const port = appPortBase + i;
    cluster.fork({ APP_PORT: port });
    appPorts.push(port);
  }
} else {
  startServer(+(process.env.APP_PORT || 3000), controller);
}
