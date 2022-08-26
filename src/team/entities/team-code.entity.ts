import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('team_code')
export class TeamCodeEntity {

    @PrimaryColumn({
        length: 6
    })
    code: string;

    @ManyToOne(type => TeamEntity, team => team.members, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'teamId'})
    team: TeamEntity;

    @Column({nullable: false, length: 32})
    teamId: string;

    @Column({nullable: false})
    createdAt: Date;
}
