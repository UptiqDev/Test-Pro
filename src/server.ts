import { v1Router } from './router/index.ts';
import { ErrorCode, ErrorWithCode } from '@error';
import express, { Application, NextFunction, Request, Response } from 'express';
import type { Server as HTTPServer } from 'http';
import { createServer } from 'http';

export function createApp(): Application {
    const app: Application = express();
    app.use(express.json());

    app.get('/', (_req: Request, res: Response) => {
        res.status(200).json({ message: 'Hello from Docker!' });
    });

    app.use('/v1', v1Router);

    app.use((_req: Request, _res: Response, next: NextFunction) => {
        next(new ErrorWithCode(ErrorCode.NOT_FOUND, 'Route not found'));
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof ErrorWithCode) {
            res.status(err.status).json({ code: err.code, message: err.message });
            return;
        }
        console.error(err);
        res.status(500).json({ code: ErrorCode.INTERNAL_SERVER_ERROR, message: 'Something went wrong' });
    });

    return app;
}

export async function start(params: { port: number; service: { name: string } }): Promise<HTTPServer> {
    const { port, service } = params;
    const httpServer = createServer(createApp());

    await new Promise<void>(resolve => httpServer.listen(port, resolve));
    console.log(`${service.name} running on port ${port}`);

    return httpServer;
}
