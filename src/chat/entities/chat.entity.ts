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
    
    @ManyToOne(type => UserEntity)
    @JoinColumn({name: 'usercode'})
    userFK: number;

    @RelationId((chat: ChatEntity) => chat.userFK)
    usercode: number;
    
    @ManyToOne(type => ChatRoomEntity)
    @JoinColumn({name: 'roomId'})
    roomFK: number;

    @RelationId((chat: ChatEntity) => chat.roomFK)
    roomId: number;

    @Column()
    date: Date;

    @Column({type: 'mediumtext'})
    content: string;
}
