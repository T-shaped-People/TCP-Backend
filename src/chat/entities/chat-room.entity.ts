import { Entity, Column, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('chat_room')
export class ChatRoomEntity {
    @Column({
        type: 'binary',
        length: 16,
        primary: true,
        nullable: false
    })
    id: Buffer;

    @ManyToOne(type => TeamEntity, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'teamId'})
    teamFK: Buffer;
    
    @RelationId((chatRoom: ChatRoomEntity) => chatRoom.teamFK)
    teamId: Buffer;

    @Column()
    date: Date;

    @Column({type: 'tinytext'})
    title: string;
}
