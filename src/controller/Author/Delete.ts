import {Request, Response} from "express";
import {getManager} from "typeorm";
import {AuthorRepository} from "../../repository/AuthorRepository";
import eventEmitter from '../../events';
import HttpException from "../../error/HttpException";

/**
 * Delete author by ID
 * DELETE /authors/:id
 */
export async function deleteAuthor(req: Request, res: Response) {

    const authorRepository = getManager().getCustomRepository(AuthorRepository); 
    try {
        const authorId: number = parseInt(req.params.id as string, 10);
        const results = await authorRepository.delete(authorId);
        eventEmitter.emit('author.deleted', authorId);
        
        return res.send(results);
    
    } catch (error: any) {
        if (error instanceof HttpException) {
            res.status(error.statusCode || 400).send(error.message);
        
        } else if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}
