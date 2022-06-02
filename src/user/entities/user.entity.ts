import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
    @PrimaryColumn({unsigned: true})
    usercode: number;

    @Column({
        nullable: false,
        length: 20
    })
    nickname: string;

    @Column({
        nullable: false,
        type: 'smallint'
    })
    enrolled: number;

    @Column({
        nullable: false,
        type: 'tinyint'
    })
    grade: number;

    @Column({
        nullable: false,
        type: 'tinyint'
    })
    classNo: number;

    @Column({
        nullable: false,
        type: 'tinyint'
    })
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
