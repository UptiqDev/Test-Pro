import { ErrorCode, HTTPErrorCode } from './codes.ts';

export class ErrorWithCode extends Error {
    readonly code: ErrorCode;
    readonly status: number;

    constructor(code: ErrorCode, message: string) {
        super(message);
        this.name = 'ErrorWithCode';
        this.code = code;
        this.status = HTTPErrorCode[code];
    }
}
