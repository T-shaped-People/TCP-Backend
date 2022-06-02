import { Entity, Column, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('team')
export class TeamEntity {
    @Column({
        type: 'binary',
        length: 16,
        primary: true,
        nullable: false
    })
    id: Buffer;

    @ManyToOne(type => UserEntity)
    @JoinColumn({name: 'usercode'})
    userFK: UserEntity;

    @RelationId((team: TeamEntity) => team.userFK)
    leader: number;
    
    @Column({
        length: 32
    })
    name: string;
}
