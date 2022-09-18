import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('calendar')
export class CalendarEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @ManyToOne(type => UserEntity, user => user.usercode)
    @JoinColumn({name: 'usercode'})
    user: UserEntity;

    @Column({nullable: false, unsigned: true})
    usercode: number;
    
    @ManyToOne(type => TeamEntity, team => team.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'teamId'})
    team: TeamEntity;

    @Column({nullable: false, length: 32})
    teamId: string;
    
    @Column({
        type: Date
    })
    date: Date;

    @Column({
        type: 'text'
    })
    content: string;
}
