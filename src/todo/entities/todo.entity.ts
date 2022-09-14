import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn, ManyToMany } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';


@Entity('todo')
export class TodoEntity {
    
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @Column({
        default: false
    })
    completed: boolean;
    
    @ManyToOne(type => UserEntity, user => user.usercode)
    @JoinColumn({name: 'usercode'})
    user: UserEntity;

    @Column({nullable: false, unsigned: true})
    usercode: number;
    
    @Column({nullable: false, unsigned: true, default: 0})
    mention: number;

    @ManyToOne(type => TeamEntity, team => team.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'teamId'})
    team: TeamEntity;

    @Column({nullable: false, length: 32})
    teamId: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        type: Date
    })
    endAt: Date;

    @Column({
        length: 50
    })
    title: string;

    @Column({
        type: 'mediumtext'
    })
    todo: string;
}
