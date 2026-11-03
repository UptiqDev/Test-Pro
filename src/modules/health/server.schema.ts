import { z } from 'zod';

export const GetHealthResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        status: z.literal('ok'),
        uptimeSeconds: z.number()
    })
});

export const GreetRequestSchema = z.object({
    name: z.string().min(1)
});

export const GreetResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        greeting: z.string()
    })
});
