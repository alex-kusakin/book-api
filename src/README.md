# Books API

Simple books collction API.

## Commands

### Build & Run
```
npm run build
npm run start
```
### Dev Run
```
npm run dev
```
### Tests
```
npm run test
```

## API Usage

### Books

#### GET /books
Get list of books
Optional query parameters: 
* page  - page number (default: 1)
* limit - page size (default: 100)
* query - fulltext search by book

Examples:
Request:
```
curl -X GET "http://localhost:3033/books?page=2&limit=10"
```
Response:
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
```
curl -X GET http://localhost:3033/books/58
```
```
curl -X POST http://localhost:3033/books -H "Content-Type: application/json" -d '{"title":"TestTitle 999", "description": "test 111", "authors":  [{"firstName": "Alex2", "lastName" : "KusakinX41"},{"firstName": "John2", "lastName": "X41"}]}'
```
```
curl -X PUT http://localhost:3033/books/58 -H "Content-Type: application/json" -d '{"title":"TestTitle 999", "description": "test 111"}'
```
```
curl -X DELETE http://localhost:3033/books/49
```
```
curl -X POST http://localhost:3033/books/3/authors/11
```
```
curl -X DELETE http://localhost:3033/books/3/authors/11
```






```
curl -X GET http://localhost:3033/authors
```
```
curl -X GET http://localhost:3033/authors/95
```
```
curl -X POST http://localhost:3033/authors -H "Content-Type: application/json" -d '{"firstName":"Alx", "lastName": "Kuuu"}'
```
```
curl -X PUT http://localhost:3033/authors/105 -H "Content-Type: application/json" -d '{"firstName":"Alx3", "lastName": "Kuu3"}'
```
```
curl -X DELETE http://localhost:3033/authors/95
```


