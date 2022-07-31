import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('token')
export class TokenEntity {

    @PrimaryColumn({
        length: 128
    })
    token: string;

    @Column({
        default: true
    })
    valid: boolean;

    @ManyToOne(type => UserEntity, user => user.usercode)
    @JoinColumn({name: 'usercode'})
    user: UserEntity;

    @Column({nullable: false, unsigned: true})
    usercode: number;

    @Column({nullable: false})
    created: Date;
}
