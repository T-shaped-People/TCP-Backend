import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { MemberEntity } from 'src/team/entities/member.entity';

@Entity('team')
export class TeamEntity {

    @PrimaryColumn({length: 32})
    id: string;

    @ManyToOne(type => UserEntity, leader => leader.usercode)
    @JoinColumn({name: 'leaderId'})
    leader: UserEntity;

    @Column({nullable: false, unsigned: true})
    leaderId: number;
    
    @Column({
        length: 32
    })
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(type => MemberEntity, member => member.team)
    members: MemberEntity[];
}
