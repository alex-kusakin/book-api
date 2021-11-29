import {EntityRepository, Repository, In, Transaction, getManager, TransactionManager, EntityManager, DeleteResult} from "typeorm";
import {Book} from "../entity/Book";
import {Author} from "../entity/Author";
import {AuthorRepository} from "./AuthorRepository";
import ValidationException from "../error/ValidationException";
import NotFoundException from "../error/NotFoundException";
import eventEmitter from '../events';

/**
 * Books reporsitory
 */
@EntityRepository(Book)
export class BookRepository extends Repository<Book> 
{
    /**
     * Find and load book by ID
     */
    async findBookById(bookId: number): Promise<Book> {
        let book = await this.findOne({ 
            relations: ['authors'],
            where: { id: bookId }            
        });

        if (!book) {
            throw new NotFoundException('Book not found.');
        }
        
        return book;
    }

    /**
     * Find books by provided IDs
     */
    async findBooksByIds(bookIds: number[]): Promise<Book[]> {
        return await this.find({ 
            relations: ['authors'],
            where: { id: In(bookIds) }            
        });
    }

    /**
     * Create new book and authors assigned to its model
     */
     async createAndSave(book: Book): Promise<Book> {

        this.validateBook(book);
        if (!book.authors || !book.authors.length) {
            throw new ValidationException('Book must have at least one author.');
        }

        const newBook = await this.createBook(book);
        eventEmitter.emit('book.created', newBook);

        return newBook;
    }

    /**
     * Update book data only
     */
     async updateBook(bookId: number, bookData: Book): Promise<Book> {
        
        this.validateBook(bookData, true);

        let book = await this.findBookById(bookId);
        book.title = bookData.title || book.title;
        book.description = bookData.description || book.description;

        const result = await this.save(book);
        eventEmitter.emit('book.updated', book);

        return result;
    }

    /**
     * Delete book by ID
     */
     async deleteById(bookId: number): Promise<DeleteResult> {
        
        const book = await this.findBookById(bookId);
        const result = this.delete(book.id);
        eventEmitter.emit('book.deleted', book.id);

        return result;
    }
    
    /**
     * Assaing author to book
     */
     async addAuthorToBookById(bookId: number, authorId: number): Promise<void> {

        let book = await this.findBookById(bookId);
        const result = await getManager().createQueryBuilder()
            .relation(Book, 'authors')
            .of(book)
            .add(authorId); 

        eventEmitter.emit('book.updated', book);

        return result;
    }

    /**
     * Unassign author from book
     */
     async deleteAuthorFromBook(bookId: number, authorId: number) {

        let book = await this.findBookById(bookId);

        let foundAuthor = false;
        book.authors = book.authors.filter(author => {
            if (author.id === authorId) {
                foundAuthor = true;
            }
            return author.id !== authorId;
        });

        if (!foundAuthor) {
            throw new NotFoundException(`Author with ID ${authorId} is not assigned to this book.`);
        }
        
        this.validateBook(book);

        const result = await this.save(book);
        eventEmitter.emit('book.updated', book);
        
        return result;
    }
    
    @Transaction()
    private async createBook(book: Book, @TransactionManager() manager?: EntityManager): Promise<Book> {
        
        manager = manager || getManager();
        const authorRepository = manager.getCustomRepository(AuthorRepository);

        let bookData  = new Book();
        bookData.title = book.title;
        bookData.description = book.description;
        
        try {
            bookData = await manager.save(bookData);  
        
            if (book.authors) {
                let promises = [];
                for (let i in book.authors) {
                    promises.push(this.updateBookAuthor(bookData, book.authors[i], authorRepository, manager));
                }
                await Promise.all(promises);
            }    

            return bookData;
        
        } catch (error: any) {
            console.error(error);
            throw new ValidationException('Cannot create book. Invalid data.');
        }
    }

    private async updateBookAuthor(book: Book, author: Author, authorRepository: AuthorRepository, manager: EntityManager): Promise<Author> {

        if (author.id) {
            author = await authorRepository.updateAuthor(author.id, author);            
        } else {
            author = await authorRepository.createOrUpdate(author);
        }

        return this.addAuthorToBook(book, author, manager);
    }

    private async addAuthorToBook(book: Book, author: Author, manager: EntityManager): Promise<Author> {
        
        await manager.createQueryBuilder()
            .relation(Book, 'authors')
            .of(book)
            .add(author.id); 

        return author;
    }

    private validateBook(book: Book, ignoreAuthors = false): void {
        
        const MAX_STRING_LENGTH = 255;

        if (typeof book.title !== 'string' || book.title.length > MAX_STRING_LENGTH) {
            throw new ValidationException(
                `Book title must be a string and no longer than ${MAX_STRING_LENGTH} chars.`
            );
        }

        if (!ignoreAuthors && (!book.authors || !book.authors.length)) {
            throw new ValidationException('Book must have at least one author.');
        }
    }
}