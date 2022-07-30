import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn, RelationId, CreateDateColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('team')
export class TeamEntity {

    @PrimaryColumn({length: 32})
    id: string;

    @ManyToOne(type => UserEntity, user => user.usercode)
    @JoinColumn({name: 'leader'})
    leader: UserEntity;

    @RelationId((team: TeamEntity) => team.leader)
    leaderId: number
    
    @Column({
        length: 32
    })
    name: string;

    @CreateDateColumn()
    createdAt: Date
}
