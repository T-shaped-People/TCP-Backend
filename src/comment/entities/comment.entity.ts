import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { PostEntity } from 'src/post/entities/post.entity';

@Entity('comment')
export class CommentEntity {
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @Column({
        default: false
    })
    deleted: boolean;
    
    @ManyToOne(type => UserEntity)
    @JoinColumn({name: 'usercode'})
    userFK: number;

    @RelationId((comment: CommentEntity) => comment.userFK)
    usercode: number;
    
    @ManyToOne(type => PostEntity)
    @JoinColumn({name: 'postId'})
    postFK: number;

    @RelationId((comment: CommentEntity) => comment.postFK)
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
    parentId: number | null;

    @Column()
    created: Date;

    @Column({
        type: 'text'
    })
    content: string;
}
