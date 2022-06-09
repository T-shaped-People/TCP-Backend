import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, RelationId, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { RoomEntity } from './room.entity';

@Entity('chat')
export class ChatEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    chatid: number;

    @ManyToOne(type => UserEntity)
    @JoinColumn({name: 'usercode'})
    userFK: number;

    @RelationId((user: ChatEntity) => user.userFK)
    usercode: number;

    @ManyToOne(type => RoomEntity)    
    @JoinColumn({name: 'id'})
    roomFK: string;

    @RelationId((room: ChatEntity) => room.roomFK)
    roomid: string;
    
    @Column()
    date: Date;

    @Column({
        length: 1000,
        // nullable: false
    })
    content: string;
}
