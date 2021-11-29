import {getAllBooks} from "./controller/Book/GetAll";
import {getBookById} from "./controller/Book/GetById";
import {createBook} from "./controller/Book/Create";
import {updateBook} from "./controller/Book/Update";
import {deleteBook} from "./controller/Book/Delete";
import {assignAuthor} from "./controller/Book/AssignAuthor";
import {unassignAuthor} from "./controller/Book/UnassignAuthor";
import {getAllAuthors} from "./controller/Author/GetAll";
import {getAuthorById} from "./controller/Author/GetById";
import {createAuthor} from "./controller/Author/Create";
import {updateAuthor} from "./controller/Author/Update";
import {deleteAuthor} from "./controller/Author/Delete";

/**
 * API Routers
 */
type RoutesType = {
    path: string,
    method: string
    action: Function
}

// export default function configureApp(app) {
// }

export const Routes: RoutesType[] = [
    // Books API
    { path: "/books", method: "get", action: getAllBooks },
    { path: "/books/:id", method: "get", action: getBookById },
    { path: "/books", method: "post", action: createBook },
    { path: "/books/:id", method: "put", action: updateBook },
    { path: "/books/:id", method: "delete", action: deleteBook },
    { path: "/books/:bookId/authors/:authorId", method: "post", action: assignAuthor },
    { path: "/books/:bookId/authors/:authorId", method: "delete", action: unassignAuthor },

    // Authors API
    { path: "/authors", method: "get", action: getAllAuthors },
    { path: "/authors/:id", method: "get", action: getAuthorById },
    { path: "/authors", method: "post", action: createAuthor },
    { path: "/authors/:id", method: "put", action: updateAuthor },
    { path: "/authors/:id", method: "delete", action: deleteAuthor },
];