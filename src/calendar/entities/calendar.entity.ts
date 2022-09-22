import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('calendar')
@Unique(['startDate', 'endDate'])
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
    startDate: Date;

    @Column({
        type: Date
    })
    endDate: Date;

    @Column({
        type: 'text'
    })
    content: string;
}
