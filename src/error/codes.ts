export enum ErrorCode {
    BAD_REQUEST = 'BAD_REQUEST',
    NOT_FOUND = 'NOT_FOUND',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

export const HTTPErrorCode: Record<ErrorCode, number> = {
    [ErrorCode.BAD_REQUEST]: 400,
    [ErrorCode.NOT_FOUND]: 404,
    [ErrorCode.INTERNAL_SERVER_ERROR]: 500
};
