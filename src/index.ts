import * as server from './server.ts';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    const port = parseInt(process.env.PORT || '3000');

    await server.start({
        port,
        service: {
            name: process.env.SERVICE_NAME || 'Test Pro Backend'
        }
    });
})();
