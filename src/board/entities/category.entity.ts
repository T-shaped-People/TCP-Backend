import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('category')
export class CategoryEntity {
    @PrimaryColumn({
        length: 10
    })
    id: string;

    @Column({
        nullable: false,
        length: 10
    })
    name: string;
}
