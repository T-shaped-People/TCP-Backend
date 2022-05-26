import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('post')
export class PostEntity {
    @PrimaryColumn()
    id: number;

    @Column({
        nullable: false
    })
    deleted: boolean;
    
    @Column({
        nullable: false
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
        nullable: false
    })
    hit: number;
    
    @Column({
        nullable: false
    })
    commentCnt: number;

    @Column({
        nullable: false,
        length: 50
    })
    title: string;

    @Column({
        nullable: false
    })
    content: string;
}
