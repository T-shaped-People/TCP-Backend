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

    @Column({nullable: false})
    usercode: number;

    @Column({nullable: false})
    created: Date;
}
