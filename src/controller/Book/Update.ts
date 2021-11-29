import {Request, Response} from "express";
import {getManager} from "typeorm";
import {BookRepository} from "../../repository/BookRepository";
import HttpException from "../../error/HttpException";

/**
 * Update existing book data
 * PUT /books/:id
 * Data: {"title":"...", "description": "..."}
 */
export async function updateBook(req: Request, res: Response) {

    const bookId: number  = parseInt(req.params.id as string, 10);
    const bookRepository = getManager().getCustomRepository(BookRepository); 

    try {
        const book = await bookRepository.updateBook(bookId, req.body);
        return res.send(book);

    } catch (error: any) {
        if (error instanceof HttpException) {
            res.status(error.statusCode || 400).send(error.message);
        
        } else if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}