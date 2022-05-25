import { UserEntity } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

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

    @ManyToOne(
        type => UserEntity,
        user => user.usercode
    )
    @JoinColumn({
        name: 'usercode'
    })
    usercode: number;

    @Column({nullable: false})
    created: Date;

}
