import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @Column({
        default: false
    })
    deleted: boolean;
    
    @Column({
        unsigned: true
    })
    usercode: number;
    
    @Column({
        length: 10
    })
    category: string;

    @Column({
        nullable: false
    })
    created: Date;
    
    @Column({
        unsigned: true,
        default: 0
    })
    hit: number;
    
    @Column({
        unsigned: true,
        default: 0
    })
    commentCnt: number;

    @Column({
        length: 50
    })
    title: string;

    @Column({
        type: 'mediumtext'
    })
    content: string;
}
