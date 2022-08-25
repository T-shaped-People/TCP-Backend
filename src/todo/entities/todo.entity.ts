import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';


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
