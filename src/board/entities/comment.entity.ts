import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

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
    userFK: UserEntity;

    @RelationId((comment: CommentEntity) => comment.userFK)
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
    parentId: number | null;

    @Column()
    created: Date;

    @Column({
        type: 'text'
    })
    content: string;
}
