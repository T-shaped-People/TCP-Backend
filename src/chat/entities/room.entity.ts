import { Entity, Column, PrimaryGeneratedColumn, RelationId, ManyToOne, JoinColumn } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('room')
export class RoomEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => TeamEntity)    
    @JoinColumn({name: 'teamid'})
    teamFK: TeamEntity;

    @RelationId((team: RoomEntity) => team.teamFK)
    teamid: number;
    
    @Column()
    create: Date;

    @Column({
        length: 20,
        // nullable: false
    })
    name: string;

}
