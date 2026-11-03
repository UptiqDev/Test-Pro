import { start } from '../../../server.ts';
import { getHealth, greet } from '../main.ts';
import type { Server } from 'http';
import type { AddressInfo } from 'net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('health module', () => {
    describe('main', () => {
        it('getHealth returns ok', () => {
            expect(getHealth().status).toBe('ok');
        });

        it('greet builds a greeting', () => {
            expect(greet('Alpha')).toBe('Hello, Alpha!');
        });
    });

    describe('routes', () => {
        let server: Server;
        let baseUrl: string;

        beforeAll(async () => {
            server = await start({ port: 0, service: { name: 'test' } });
            baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
        });

        afterAll(() => {
            server.close();
        });

        it('GET /v1/health returns 200', async () => {
            const res = await fetch(`${baseUrl}/v1/health`);
            const body = await res.json();
            expect(res.status).toBe(200);
            expect(body.data.status).toBe('ok');
        });

        it('POST /v1/greet returns a greeting', async () => {
            const res = await fetch(`${baseUrl}/v1/greet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Alpha' })
            });
            const body = await res.json();
            expect(res.status).toBe(200);
            expect(body.data.greeting).toBe('Hello, Alpha!');
        });

        it('POST /v1/greet without name returns 400', async () => {
            const res = await fetch(`${baseUrl}/v1/greet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            expect(res.status).toBe(400);
            expect((await res.json()).code).toBe('BAD_REQUEST');
        });

        it('unknown route returns 404', async () => {
            const res = await fetch(`${baseUrl}/nope`);
            expect(res.status).toBe(404);
        });
    });
});
