import {Entity, JoinColumn, OneToOne, Index, Column} from "typeorm";
import {Book} from "./Book";

/**
 * Book full text search index model
 */
@Entity()
export class BookSearchIndex {

    @OneToOne(() => Book, {
        primary: true, onDelete:'CASCADE', nullable: false, eager: true
    })
    @JoinColumn()
    book: Book;

    @Index({ fulltext: true })
    @Column()
    title: string;

    @Index({ fulltext: true })
    @Column("text")
    description: string;

    @Index({ fulltext: true })
    @Column("text")
    authors: string;

}