import {Request, Response} from "express";
import {getManager} from "typeorm";
import {BookRepository} from "../../repository/BookRepository";
import HttpException from "../../error/HttpException";

/**
 * Unassign author from book
 * DELETE /books/:bookId/authors/:authorId
 */
export async function unassignAuthor(req: Request, res: Response) {

    const bookId: number = parseInt(req.params.bookId as string, 10);
    const authorId: number = parseInt(req.params.authorId as string, 10);

    try {
        const bookRepository = getManager().getCustomRepository(BookRepository); 
        const results = await bookRepository.deleteAuthorFromBook(bookId, authorId);
        
        return res.send(results);
    
    } catch (error: any) {
        if (error instanceof HttpException) {
            res.status(error.statusCode || 400).send(error.message);
        
        } else if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}
