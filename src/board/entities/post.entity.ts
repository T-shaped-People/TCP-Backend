import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { CategoryEntity } from 'src/board/entities/category.entity';

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @Column({
        default: false
    })
    deleted: boolean;
    
    @ManyToOne(type => UserEntity)
    @JoinColumn({name: 'usercode'})
    userFK: UserEntity;

    @RelationId((post: PostEntity) => post.userFK)
    usercode: number;
    
    @ManyToOne(type => CategoryEntity)
    @JoinColumn({name: 'category'})
    categoryFK: CategoryEntity;

    @RelationId((post: PostEntity) => post.categoryFK)
    category: string;

    @Column({
        nullable: false
    })
    created: Date;
    
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
}
