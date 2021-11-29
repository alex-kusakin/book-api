import HttpException from "./HttpException";

/**
 * HTTP exception 
 */
export default class NotFoundException extends HttpException {

    constructor(message: string, error?: string) 
    {
        super(404, message, error);
    }
}