/// <reference types="." />
import 'dotenv/config';
import express from 'express';
import cookies from 'cookie-parser';

import { rootController } from '@Controllers';

import { DBService } from '@Services/DBService/DB.service';

const server = express();
const port = +process.env.API_PORT!;

server.use(cookies());
server.use(express.json());

server.use(rootController.router);

server.listen(port, async () => {
  await DBService.getInstance().testConnection();
  console.log('Server started');
});

export { server };
