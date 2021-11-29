import {Request, Response} from "express";
import {getManager} from "typeorm";
import {AuthorRepository} from "../../repository/AuthorRepository";
import eventEmitter from '../../events';
import HttpException from "../../error/HttpException";

/**
 * Create new author router
 * POST /authors 
 * Data: {"firstName":"...", "lastName": "..."}
 */
export async function createAuthor(req: Request, res: Response) {

    const authorRepository = getManager().getCustomRepository(AuthorRepository); 
    try {
        const author = await authorRepository.createAndSave(req.body);         
        eventEmitter.emit('author.created', author);
           
        return res.status(201).send(author);
    
    } catch (error: any) {
        if (error instanceof HttpException) {
            res.status(error.statusCode || 400).send(error.message);
        
        } else if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}
