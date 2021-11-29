import {Request, Response} from "express";
import {getManager} from "typeorm";
import {AuthorRepository} from "../../repository/AuthorRepository";
import eventEmitter from '../../events';
import HttpException from "../../error/HttpException";

/**
 * Update author entity by ID
 * PUT /author/:id
 * Data: {"firstName":"...", "lastName": "..."}
 */
export async function updateAuthor(req: Request, res: Response) {

    const authorRepository = getManager().getCustomRepository(AuthorRepository); 
    try {
        const authorId: number  = parseInt(req.params.id as string, 10);
        const author = await authorRepository.updateAuthor(authorId, req.body);
        eventEmitter.emit('author.updated', author);
        
        return res.send(author);

    } catch (error: any) {
        if (error instanceof HttpException) {
            res.status(error.statusCode || 400).send(error.message);
        
        } else if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}