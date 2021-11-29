import {Express} from "express";
import {Server} from 'http'; 
import chai from 'chai';
import chaiHttp from 'chai-http';
import init from '../app';

chai.use(chaiHttp);
chai.should();

let app: Express;
let server: Server;

describe("Book Tests", () => {

    let bookStubId = 0;
    let authorStubId = 0;
    let bookStub = { 
        title: 'TEST_BOOK_TITLE_1', 
        description: 'TEST_BOOK_DESTRICTION_1',
        authors: [
            {
                firstName: "TestA1",
                lastName: "TestA1_last",
            }
        ]
    };

    before(async function() {
        console.log("Before executed")
        const appData = await init;
        if (appData) {
            app = appData.app;
            server = appData.server;
        }
    });

    after(() => {        
        server.close();
        console.log("After executed")
    });

    it("GET /books - check response", (done) => {
        chai.request(app)
            .get('/books')
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.not.be.empty;
                response.body.should.be.a('object');
                response.body.items.should.be.a('array');
                response.body.pagination.should.not.be.empty;
                done();
            });
    });

    it("POST /books - missing author", (done) => {
        chai.request(app)
            .post('/books')
            .send({ title: 'TEST_BOOK_TITLE_2', description: 'TEST_BOOK_DESTRICTION_2'})
            .end((err, response) => {
                response.should.have.status(400);
                done();
            });
    });
    
    it("POST /books - create valid book", (done) => {
        chai.request(app)
            .post('/books')
            .send(bookStub)
            .end((err, response) => {
                response.should.have.status(201);
                response.body.should.not.be.empty;
                response.body.id.should.be.a('number');
                response.body.authors.should.be.a('array');
                response.body.authors.should.not.be.empty;
                response.body.authors[0].id.should.be.a('number');

                bookStubId = response.body.id;
                authorStubId = response.body.authors[0].id;

                done();
            });
    });

    it("GET /books - check added", (done) => {
        chai.request(app)
            .get('/books/' + bookStubId)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.not.be.empty;
                response.body.id.should.equal(bookStubId);
                response.body.title.should.equal(bookStub.title);
                response.body.description.should.equal(bookStub.description);
                response.body.authors.should.be.a('array');
                response.body.authors.should.not.be.empty;
                done();
            });
    });

    const bookStubUpdate = {title: "New TEST Title"};
    it("PUT /books - update book title", (done) => {
        chai.request(app)
            .put('/books/' + bookStubId)
            .send(bookStubUpdate)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.not.be.empty;
                response.body.id.should.be.a('number');
                response.body.id.should.equal(bookStubId);
                response.body.title.should.equal(bookStubUpdate.title);
                response.body.description.should.equal(bookStub.description);
                done();
            });
    });
    
    it("GET /books - check after update", (done) => {
        chai.request(app)
            .get('/books/' + bookStubId)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.not.be.empty;
                response.body.id.should.equal(bookStubId);
                response.body.title.should.equal(bookStubUpdate.title);
                response.body.description.should.equal(bookStub.description);
                response.body.authors.should.be.a('array');
                response.body.authors.should.not.be.empty;
                done();
            });
    });

    it("DELETE /books - delete stub book", (done) => {
        chai.request(app)
            .delete('/books/' + bookStubId)
            .end((err, response) => {
                response.should.have.status(200);
                done();
            });
    });

    it("GET /books - check after deleted - not found", (done) => {
        chai.request(app)
            .get('/books/' + bookStubId)
            .end((err, response) => {
                response.should.have.status(404);
                done();
            });
    });

    it("DELETE /authors - delete stub author", (done) => {
        chai.request(app)
            .delete('/authors/' + authorStubId)
            .end((err, response) => {
                response.should.have.status(200);
                done();
            });
    });

    it("GET /authors - check after deleted - not found", (done) => {
        chai.request(app)
            .get('/authors/' + authorStubId)
            .end((err, response) => {
                response.should.have.status(404);
                done();
            });
    });
});
