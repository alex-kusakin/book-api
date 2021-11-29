import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import {Author} from "./Author";

/**
 * Book data model 
 */
@Entity()
export class Book {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column("text")
    description: string;

    @ManyToMany(type => Author, {
        cascade: true
    })    
    @JoinTable()
    authors: Author[];

}