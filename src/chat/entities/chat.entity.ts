import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';
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
    
    @ManyToOne(type => ChatRoomEntity, room => room.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'roomId'})
    room: ChatRoomEntity;

    @Column({nullable: false, length: 32})
    roomId: string;

    @ManyToOne(type => UserEntity, user => user.usercode)
    @JoinColumn({name: 'usercode'})
    user: UserEntity;

    @Column({nullable: false, unsigned: true})
    usercode: number;

    @Column({
        length: 1000,
        nullable: false
    })
    content: string;

    @CreateDateColumn()
    createdAt: Date
}
