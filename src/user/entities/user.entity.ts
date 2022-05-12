import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
    @PrimaryColumn()
    usercode: number;

    @Column({
        nullable: false,
        length: 20
    })
    nickname: string;

    @Column({nullable: false})
    enrolled: number;

    @Column({nullable: false})
    grade: number;

    @Column({nullable: false})
    classNo: number;

    @Column({nullable: false})
    studentNo: number;

    @Column({
        length: 20,
        nullable: false
    })
    name: string;

    @Column({
        length: 320,
        nullable: false
    })
    email: string;
}
