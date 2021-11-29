import {Request, Response} from "express";
import {getManager} from "typeorm";
import {BookRepository} from "../../repository/BookRepository";
import {BookSearch} from "../../repository/BookSearch";
import {Book} from "../../entity/Book";
import HttpException from "../../error/HttpException";

const DEFAULT_LIMIT: number = 100;
const MIN_SEARCH_QUERY_LENGTH: number = 3;

/**
 * Get all books or search
 * GET /books
 * Params: page, limit, query
 */
export async function getAllBooks(req: Request, res: Response) {

    const page = Math.max(1, parseInt(req.query.page as string, 10)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit as string, 10)) || DEFAULT_LIMIT;
    const skip = (page - 1) * limit;
    const take = page * limit;

    let books: Book[] = [];
    let count: number = 0;

    try {
        [books, count] = await processRequest(req, take, skip);

        res.json({
            items: books,
            pagination: {
                count: books.length,
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

async function processRequest(req: Request, take: number, skip: number): Promise<[Book[], number]>
{
    const query = req.query.query;        
    if (query) {
        if (typeof query !== 'string' || query.trim().length < MIN_SEARCH_QUERY_LENGTH) {
            throw new HttpException(400, `Search query should have at least ${MIN_SEARCH_QUERY_LENGTH} letters.`);
        }

        const bookSearch = getManager().getCustomRepository(BookSearch); 
        return await bookSearch.searchAndCount(query.trim(), take, skip);
    
    } 

    const bookRepository = getManager().getCustomRepository(BookRepository); 
    return await bookRepository.findAndCount({
        relations: ['authors'],
        skip: skip,
        take: take,
    });
}