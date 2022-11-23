import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('link')
export class LinkEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;
    
    @ManyToOne(type => TeamEntity, team => team.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'teamId'})
    team: TeamEntity;

    @Column({nullable: false, length: 32})
    teamId: string;

    @Column({nullable: false, length: 16})
    title: string;

    @Column({nullable: false, length: 255})
    link: string;
}
