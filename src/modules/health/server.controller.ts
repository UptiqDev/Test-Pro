import { getHealth, greet } from './main.ts';
import { GetHealthResponseSchema, GreetRequestSchema, GreetResponseSchema } from './server.schema.ts';
import { ErrorCode, ErrorWithCode } from '@error';
import { Request, Response } from 'express';

export function getHealthController(_req: Request, res: Response): void {
    const response = GetHealthResponseSchema.parse({
        message: 'Service is healthy',
        data: getHealth()
    });
    res.status(200).json(response);
}

export function greetController(req: Request, res: Response): void {
    const parsed = GreetRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ErrorWithCode(ErrorCode.BAD_REQUEST, 'name is required');
    }
    const response = GreetResponseSchema.parse({
        message: 'Greeting created successfully',
        data: { greeting: greet(parsed.data.name) }
    });
    res.status(200).json(response);
}
