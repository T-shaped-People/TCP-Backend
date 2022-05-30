import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comment')
export class CommentEntity {
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
        unsigned: true
    })
    postId: number;

    @Column({
        nullable: false,
        unsigned: true
    })
    depth: number;
    
    @Column({
        nullable: false,
        default: false
    })
    parent: boolean;
    
    @Column({
        nullable: false,
        unsigned: true
    })
    parentId: number;

    @Column({
        nullable: false
    })
    created: Date;

    @Column({
        nullable: false,
        type: 'text'
    })
    content: string;
}
