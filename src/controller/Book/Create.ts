import {Request, Response} from "express";
import {getManager} from "typeorm";
import {BookRepository} from "../../repository/BookRepository";
import HttpException from "../../error/HttpException";

/**
 * Create new book
 * POST /books
 * Data: {"title":"...", "description": "...", "authors": [{"firstName":"...", "lastName":"..."},...]}
 */
export async function createBook(req: Request, res: Response) {

    const bookRepository = getManager().getCustomRepository(BookRepository); 
    try {
        const book = await bookRepository.createAndSave(req.body);         
        return res.status(201).send(await bookRepository.findBookById(book.id));
    
    } catch (error: any) {
        if (error instanceof HttpException) {
            res.status(error.statusCode || 400).send(error.message);
        
        } else if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}
