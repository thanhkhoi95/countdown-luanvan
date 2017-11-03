export interface IError {
    statusCode: number;
    message: string;
}

export interface ISuccess {
    message: string;
    data: object;
}
