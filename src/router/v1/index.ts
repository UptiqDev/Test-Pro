import { health } from '@modules';
import express from 'express';

export const v1Router = express.Router();

v1Router.use(health.serverRoutes.router);
