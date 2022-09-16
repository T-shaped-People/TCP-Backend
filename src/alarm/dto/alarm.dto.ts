import { Expose } from "@nestjs/class-transformer";

export class AlarmDTO {
    
    @Expose()
    completed: true

    @Expose()
    createdAt: true

    @Expose()
    endAt: true

    @Expose()
    title: true

    @Expose()
    todo: true
}