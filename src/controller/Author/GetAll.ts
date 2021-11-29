import {Request, Response} from "express";
import {getManager} from "typeorm";
import {AuthorRepository} from "../../repository/AuthorRepository";
import HttpException from "../../error/HttpException";

const DEFAULT_LIMIT: number = 100;

/**
 * Get all authors
 * GET /authors
 * Params: page, limit
 */
export async function getAllAuthors(req: Request, res: Response) {

    const page = Math.max(1, parseInt(req.query.page as string, 10)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit as string, 10)) || DEFAULT_LIMIT;
    
    const authorRepository = getManager().getCustomRepository(AuthorRepository); 

    try {
        const [authors, count] = await authorRepository.findAndCount({
            skip: (page - 1) * limit,
            take: page * limit,
        });

        res.json({
            items: authors,
            pagination: {
                count: authors.length,
                currentPage: page,
                perPage: limit,
                totalPages: Math.ceil(count / limit),
                total: count
            }
        });

    } catch (error: any) {
        if (error instanceof HttpException) {
            res.status(error.statusCode || 400).send(error.message);
        
        } else if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}