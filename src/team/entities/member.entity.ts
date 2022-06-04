import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('member')
export class MemberEntity {
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @ManyToOne(type => TeamEntity)
    @JoinColumn({name: 'teamId'})
    teamFK: TeamEntity;
    
    @RelationId((member: MemberEntity) => member.teamFK)
    teamId: Buffer;

    @ManyToOne(type => UserEntity)
    @JoinColumn({name: 'usercode'})
    userFK: UserEntity;

    @RelationId((member: MemberEntity) => member.userFK)
    usercode: number;
}
