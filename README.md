# Books API

Simple books collction API.

## Configuration

Files:
* ormconfig.json - database connection config (database schema wil be created automatically)
* .env - server port number 

## Commands

#### Build & Run
```
npm run build
npm run start
```
#### Dev Run
```
npm run dev
```
#### Tests
```
npm run test
```


## API Usage

### Books

---

#### GET /books
Get list of books
Optional query parameters:
* page  - page number (default: 1)
* limit - page size (default: 100)
* query - fulltext search by book

Request Examples:

```
curl -X GET "http://localhost:3033/books"
curl -X GET "http://localhost:3033/books?page=2&limit=10"
curl -X GET "http://localhost:3033/books?query=Test"
```
Response Example:
```
{
   "items":[
      {
         "id":63,
         "title":"Test Book Title 1",
         "description":"Book description",
         "authors":[
            {
               "id":101,
               "firstName":"Test Author 1",
               "lastName":"Last Name 1"
            },
            {
               "id":102,
               "firstName":"Test Author 2",
               "lastName":"Last Name 2"
            }
         ]
      },
      // ...
   ],
   "pagination":{
      "count":20,
      "currentPage":2,
      "perPage":10,
      "totalPages":6,
      "total":55
   }
}
```
---
#### GET /books/:id
Get one book by ID

Request Example:
```
curl -X GET http://localhost:3033/books/58
```
Response Example:
```
 {
     "id":63,
     "title":"Test Book Title 1",
     "description":"Book description",
     "authors":[
        {
           "id":101,
           "firstName":"Test Author 1",
           "lastName":"Last Name 1"
        },
        {
           "id":102,
           "firstName":"Test Author 2",
           "lastName":"Last Name 2"
        }
     ]
  }
```

---
#### POST /books
Create new book, with authors.
Book must have at least on author in request, the author will be created.
If author name is not unique, the existing author will be re-used. 

Fields:
* title - string, max 255 chars
* description - text
* authors - array:
  * firstName - string, max 255 chars
  * lastName - string, max 255 chars

Request Example:
```
curl -X POST http://localhost:3033/books -H "Content-Type: application/json" -d '{"title":"TestTitle 1", "description": "Test Descr 1", "authors":  [{"firstName": "Alex", "lastName" : "Kusakin"},{"firstName": "John", "lastName": "Doe"}]}'
```
Response: Created book JSON.

---
#### PUT /books/:id
Update book data.
Only book data may be updated, not authors.

```
curl -X PUT http://localhost:3033/books/58 -H "Content-Type: application/json" -d '{"title":"TestTitle 2", "description": "Descr 2 "}'
```
Response: Created book JSON.

---
#### DELETE /books/:id
Deletes book, but not its authors.
```
curl -X DELETE http://localhost:3033/books/49
```

---
#### POST /books/:bookId/authors/:authorId
Assign author to book.
```
curl -X POST http://localhost:3033/books/3/authors/11
```
Response: code 201 in case of success.

---
#### DELETE /books/:bookId/authors/:authorId
Unassign author from book
```
curl -X DELETE http://localhost:3033/books/3/authors/11
```
---


### Authors

#### GET /authors
Get list of all authors.
Optional query parameters:
* page  - page number (default: 1)
* limit - page size (default: 100)

Request examples:
```
curl -X GET "http://localhost:3033/authors"
curl -X GET "http://localhost:3033/authors?page=2&limit=10"
```
Response example:
```
{
   "items":[
        {
           "id":101,
           "firstName":"Test Author 1",
           "lastName":"Last Name 1"
        },
        {
           "id":102,
           "firstName":"Test Author 2",
           "lastName":"Last Name 2"
        }
        // ...
   ],
   "pagination":{
      "count":20,
      "currentPage":2,
      "perPage":10,
      "totalPages":6,
      "total":55
   }
}
```
---
#### GET /authors/:id
Get author data by ID

Request example:
```
curl -X GET http://localhost:3033/authors/95
```
Response example:
```
{
   "id":102,
   "firstName":"Test Author 2",
   "lastName":"Last Name 2"
}
```
---
#### POST /authors
Create new author

Fields:
* firstName - string, max 255 chars
* lastName - string, max 255 chars

Request example:
```
curl -X POST http://localhost:3033/authors -H "Content-Type: application/json" -d '{"firstName":"Alex", "lastName": "Kusakin"}'
```
Response: author JSON data

---
#### PUT /authors/:id
Update author data

Request example:
```
curl -X PUT http://localhost:3033/authors/105 -H "Content-Type: application/json" -d '{"firstName":"Alex 2", "lastName": "Kusakin 2"}'
```
Response: author JSON data

---
#### DELETE /authors/:id
Delete author data.
Do not delete author books.

Request example:
```
curl -X DELETE http://localhost:3033/authors/95
```
---
