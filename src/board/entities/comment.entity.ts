import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comment')
export class CommentEntity {
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
        unsigned: true
    })
    postId: number;

    @Column({
        unsigned: true
    })
    depth: number;
    
    @Column({
        default: false
    })
    parent: boolean;
    
    @Column({
        nullable: true,
        unsigned: true
    })
    parentId: number;

    @Column()
    created: Date;

    @Column({
        type: 'text'
    })
    content: string;
}
