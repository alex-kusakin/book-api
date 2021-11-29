import HttpException from "./HttpException";

/**
 * Data validation exception
 */
export default class ValidationException extends HttpException {

    constructor(message: string, error?: string) 
    {
        super(400, message, error);
    }
}