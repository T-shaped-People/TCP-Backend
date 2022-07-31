import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('team')
export class TeamEntity {

    @PrimaryColumn({length: 32})
    id: string;

    @ManyToOne(type => UserEntity, user => user.usercode)
    @JoinColumn({name: 'leaderId'})
    leader: UserEntity;

    @Column({nullable: false, unsigned: true})
    leaderId: number
    
    @Column({
        length: 32
    })
    name: string;

    @CreateDateColumn()
    createdAt: Date
}
