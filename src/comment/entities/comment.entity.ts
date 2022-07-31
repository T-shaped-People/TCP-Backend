import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';
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
    
    @ManyToOne(type => UserEntity, user => user.usercode)
    @JoinColumn({name: 'usercode'})
    user: UserEntity;

    @Column({nullable: false, unsigned: true})
    usercode: number;
    
    @ManyToOne(type => PostEntity)
    @JoinColumn({name: 'postId'})
    post: PostEntity;

    @Column({nullable: false, unsigned: true})
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

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        type: 'text'
    })
    content: string;
}
