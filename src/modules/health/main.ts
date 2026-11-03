export function getHealth(): { status: 'ok'; uptimeSeconds: number } {
    return { status: 'ok', uptimeSeconds: Math.round(process.uptime()) };
}

export function greet(name: string): string {
    return `Hello, ${name}!`;
}
