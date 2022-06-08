import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, RelationId, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('chat')
export class ChatEntity {
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @ManyToOne(type => UserEntity)
    @JoinColumn({name: 'usercode'})
    userFK: number;

    @RelationId((comment: ChatEntity) => comment.userFK)
    usercode: number;
    
    @Column()
    date: Date;

    @Column({
        type: 'text',
        length: 1000
    })
    content: string;
}
