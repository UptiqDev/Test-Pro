import { getHealthController, greetController } from './server.controller.ts';
import express from 'express';

export const router = express.Router();

router.get('/health', getHealthController);
router.post('/greet', greetController);
