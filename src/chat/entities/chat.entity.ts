import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChatRoomEntity } from 'src/chat/entities/chat-room.entity';

@Entity('chat')
export class ChatEntity {
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @Column({
        default: false
    })
    deleted: boolean;
    
    @ManyToOne(type => ChatRoomEntity)
    @JoinColumn({name: 'roomId'})
    roomFK: Buffer;

    @RelationId((chat: ChatEntity) => chat.roomFK)
    roomId: Buffer;

    @ManyToOne(type => UserEntity)
    @JoinColumn({name: 'usercode'})
    userFK: number;

    @RelationId((chat: ChatEntity) => chat.userFK)
    usercode: number;

    @Column()
    date: Date;

    @Column({
      type: 'text',
      length: 1000,
      nullable: false
    })
    content: string;
}
