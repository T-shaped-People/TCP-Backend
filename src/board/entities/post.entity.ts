import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @Column({
        nullable: false,
        default: false
    })
    deleted: boolean;
    
    @Column({
        nullable: false,
        unsigned: true
    })
    usercode: number;
    
    @Column({
        nullable: false,
        length: 10
    })
    category: string;

    @Column({
        nullable: false
    })
    created: Date;
    
    @Column({
        nullable: false,
        unsigned: true,
        default: 0
    })
    hit: number;
    
    @Column({
        nullable: false,
        unsigned: true,
        default: 0
    })
    commentCnt: number;

    @Column({
        nullable: false,
        length: 50
    })
    title: string;

    @Column({
        nullable: false,
        type: 'mediumtext'
    })
    content: string;
}
