import { Entity, Column, ManyToOne, PrimaryColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('voice_room')
export class VoiceRoomEntity {

    @PrimaryColumn({length: 32})
    id: string;

    @ManyToOne(type => TeamEntity, team => team.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'teamId'})
    team: TeamEntity;

    @Column({nullable: false, length: 32})
    teamId: string;

    @Column({type: 'tinytext'})
    title: string;
    
    @CreateDateColumn()
    createdAt: Date
}
