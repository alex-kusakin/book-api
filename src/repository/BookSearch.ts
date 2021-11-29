import {EntityRepository, Repository, SelectQueryBuilder, getManager} from "typeorm";
import {Book} from "../entity/Book";
import {BookRepository} from "./BookRepository";
import {BookSearchIndex} from "../entity/BookSearchIndex";
import NotFoundException from "../error/NotFoundException";

/**
 * Book search index
 */
@EntityRepository(BookSearchIndex)
export class BookSearch extends Repository<BookSearchIndex> 
{
    /**
     * Search books by query, return totla count as well
     */
    async searchAndCount(query: string, take: number, skip: number): Promise<[Book[], number]> {

        const result = await this.buildQuerySelect(query)
            .take(take)
            .skip(skip)
            .getRawMany();

        let bookIds: number[] = []; 
        result.forEach(bookIndex => bookIds.push(bookIndex.bookId));

        const count: number = await this.buildQuerySelect(query).getCount();
        const books = await getManager().getCustomRepository(BookRepository).findBooksByIds(bookIds);
        
        return [books, count];
    }

    /**
     * Reindex book search index
     */
    async reindexBook(book: Book): Promise<BookSearchIndex> {

        if (!book.id) {
            throw new NotFoundException('Cannot index book without ID.');
        }
        book = await getManager().getCustomRepository(BookRepository).findBookById(book.id);
        
        let bookIndex = await this.findIndexById(book.id);
        if (bookIndex === undefined) {
            bookIndex = new BookSearchIndex();
        }

        bookIndex.book = book;
        bookIndex.title = book.title;
        bookIndex.description = book.description;
        bookIndex.authors = this.convertBookAuthorsToString(book);

        return this.save(bookIndex);
    }

    /**
     * Clean search index for a book
     */
    async removeBookIndex(bookId: number): Promise<void> {
            
        let bookIndex = await this.findIndexById(bookId);
        if (bookIndex !== undefined) {
            await this.createQueryBuilder()
                .delete()
                .from(BookSearchIndex)
                .where("bookId = :id", {id: bookId})
                .execute();
        }
    }

    private async findIndexById(bookId: number): Promise<BookSearchIndex | undefined> {
        
        return await this.findOne(bookId);
    }

    private convertBookAuthorsToString(book: Book): string {
        
        let result = '';
        if (book.authors) {
            book.authors.forEach(author => {result += author.firstName + ' ' + author.lastName + ' '});
        }

        return result.trim();
    }

    private buildQuerySelect(query: string): SelectQueryBuilder<BookSearchIndex> {
        
        return this.createQueryBuilder('book')
            .select('bookId')
            .where('MATCH(title) AGAINST (:query IN NATURAL LANGUAGE MODE)', { query: query })
            .orWhere('MATCH(description) AGAINST (:query IN NATURAL LANGUAGE MODE)', { query: query })
            .orWhere('MATCH(authors) AGAINST (:query IN NATURAL LANGUAGE MODE)', { query: query });
    }
}