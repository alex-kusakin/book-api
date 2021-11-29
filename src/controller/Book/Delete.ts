import {Request, Response} from "express";
import {getManager} from "typeorm";
import {BookRepository} from "../../repository/BookRepository";
import HttpException from "../../error/HttpException";

/**
 * Delete book
 * DELETE /books/:id
 */
export async function deleteBook(req: Request, res: Response) {

    const bookRepository = getManager().getCustomRepository(BookRepository); 
    try {
        const bookId: number = parseInt(req.params.id as string, 10);
        const results = await bookRepository.deleteById(bookId);
        
        return res.send(results);
    
    } catch (error: any) {
        if (error instanceof HttpException) {
            res.status(error.statusCode || 400).send(error.message);
        
        } else if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}
