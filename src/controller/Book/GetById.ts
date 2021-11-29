import {Request, Response} from "express";
import {getManager} from "typeorm";
import {BookRepository} from "../../repository/BookRepository";
import HttpException from "../../error/HttpException";

/**
 * Get book by Id
 * GET /books/:id
 * Params: page, limit, query
 */
export async function getBookById(req: Request, res: Response) {

    const bookRepository = getManager().getCustomRepository(BookRepository); 
    try {
        const book = await bookRepository.findBookById(parseInt(req.params.id));
        return res.send(book);
    } catch (error: any) {
        if (error instanceof HttpException) {
            res.status(error.statusCode || 400).send(error.message);
        
        } else if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }        
}
