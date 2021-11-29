import {EntityRepository, Repository} from "typeorm";
import {Author} from "../entity/Author";
import ValidationException from "../error/ValidationException";
import NotFoundException from "../error/NotFoundException";

/**
 * Authors repository 
 */
@EntityRepository(Author)
export class AuthorRepository extends Repository<Author> 
{
    /**
     * Find and load author by ID
     */
    async findAuthorById(authorId: number): Promise<Author> {

        let author = await this.findOne(authorId);
        if (!author) {
            throw new NotFoundException('Author not found.');
        }
        
        return author;
    }

    /**
     * Find and load author by firstName and lastName
     */
     async findAuthorByName(firstName: string, lastName:string): Promise<Author | undefined> {

        return this.findOne({
            where: { 
                firstName: firstName, 
                lastName: lastName
            }
        });
    }

    /**
     * Create new author
     */
    async createAndSave(author: Author): Promise<Author> {
        
        this.validateAuthor(author);

        let authorData  = new Author();
        authorData.firstName = author.firstName;
        authorData.lastName = author.lastName;
        
        try {
            authorData = await this.save(authorData);  
            return authorData;

        } catch (error: any) {
            console.error(error);
            throw new ValidationException('Cannot create author. Invalid data.');
        }
    }

    /**
     * Update existing authors data
     */
    async updateAuthor(authorId: number, authorData: Author): Promise<Author> {
        
        this.validateAuthor(authorData);

        let author = await this.findAuthorById(authorId);
        author.firstName = authorData.firstName || author.firstName;
        author.lastName = authorData.lastName || author.lastName;

        return await this.save(author);
    }

    /**
     * Create new author or load existing if author with such name already exist
     */
    async createOrUpdate(author: Author): Promise<Author> {
        
        this.validateAuthor(author);
        try {
            let authorData = await this.findAuthorByName(author.firstName, author.lastName);
            if (!authorData) {
                authorData  = new Author();
                authorData.firstName = author.firstName;
                authorData.lastName = author.lastName;    
                authorData = await this.save(authorData);  
            }

            return authorData;

        } catch (error: any) {
            console.error(error);
            throw new ValidationException('Cannot create author.');
        }
    }

    private validateAuthor(author: Author): void {
        
        const MAX_STRING_LENGTH = 255;

        if (typeof author.firstName !== 'string' || author.firstName.length > MAX_STRING_LENGTH
            || typeof author.lastName !== 'string' || author.lastName.length > MAX_STRING_LENGTH
        ) {
            throw new ValidationException(
                `Author fiersName nad lastName fields must be strings and no longer than ${MAX_STRING_LENGTH} chars.`
            );
        }
    }
}