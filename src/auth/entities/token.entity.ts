import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { CommentEntity } from 'src/board/entities/comment.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('token')
export class TokenEntity {
    @PrimaryColumn({
        length: 128
    })
    token: string;

    @Column({
        default: true
    })
    valid: boolean;

    @ManyToOne(type => UserEntity)
    @JoinColumn({name: 'usercode'})
    userFK: UserEntity;

    @RelationId((comment: CommentEntity) => comment.userFK)
    usercode: number;

    @Column({nullable: false})
    created: Date;
}
