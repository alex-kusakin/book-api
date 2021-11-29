import {Entity, PrimaryGeneratedColumn, Column, Unique, Index} from "typeorm";

/**
 * Author data model 
 */
@Entity()
@Unique(["firstName", "lastName"])
export class Author {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ fulltext: true })
    @Column()
    firstName: string;

    @Index({ fulltext: true })
    @Column()
    lastName: string;
}