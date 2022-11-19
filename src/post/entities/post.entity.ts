import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { CategoryEntity } from 'src/post/entities/category.entity';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('post')
export class PostEntity {
    
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @Column({
        default: false
    })
    deleted: boolean;
    
    @ManyToOne(type => UserEntity, user => user.usercode)
    @JoinColumn({name: 'usercode'})
    user: UserEntity;

    @Column({nullable: false, unsigned: true})
    usercode: number;
    
    @ManyToOne(type => TeamEntity, team => team.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'teamId'})
    team: TeamEntity;

    @Column({nullable: true, length: 32})
    teamId: string;

    @ManyToOne(type => CategoryEntity, category => category.id)
    @JoinColumn({name: 'categoryId'})
    category: CategoryEntity;

    @Column({nullable: true, length: 10})
    categoryId: string;

    @CreateDateColumn()
    createdAt: Date;
    
    @Column({
        unsigned: true,
        default: 0
    })
    hit: number;
    
    @Column({
        unsigned: true,
        default: 0
    })
    commentCnt: number;

    @Column({
        length: 50
    })
    title: string;

    @Column({
        type: 'mediumtext'
    })
    content: string;

    @Column({length: 64})
    description: string;

    @Column({length: 16})
    field: string;
    
    
    @Column({length: 6})
    teamColor: string;
}
