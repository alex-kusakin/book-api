import {Request, Response} from "express";
import {getManager} from "typeorm";
import {AuthorRepository} from "../../repository/AuthorRepository";
import HttpException from "../../error/HttpException";

/**
 * Get author by ID
 * GET /authors/:id
 */
export async function getAuthorById(req: Request, res: Response) {

    const authorRepository = getManager().getCustomRepository(AuthorRepository); 
    try {
        const author = await authorRepository.findAuthorById(parseInt(req.params.id));
        return res.send(author);
    
    } catch (error: any) {
        if (error instanceof HttpException) {
            res.status(error.statusCode || 400).send(error.message);
        
        } else if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }        
}
