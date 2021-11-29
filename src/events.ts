import {getManager} from "typeorm";
import EventEmitter from 'events';
import {Book} from "./entity/Book";
import {BookSearch} from './repository/BookSearch';

/**
 * All custom event can be specified here 
 */

var eventEmitter  = new EventEmitter;
export default eventEmitter;


eventEmitter.on('book.created', (book: Book) => {
    const bookSearch = getManager().getCustomRepository(BookSearch); 
    bookSearch.reindexBook(book)
});

eventEmitter.on('book.updated', (book: Book) => {    
    const bookSearch = getManager().getCustomRepository(BookSearch); 
    bookSearch.reindexBook(book)
});

eventEmitter.on('book.deleted', (bookId: number) => {
    const bookSearch = getManager().getCustomRepository(BookSearch); 
    bookSearch.removeBookIndex(bookId)
});