import { Expose } from "@nestjs/class-transformer";

export class AlarmDTO {
    
    @Expose()
    alarmCategory: true

    @Expose()
    id: true

    @Expose()
    usercode: true

    @Expose()
    content: true

    @Expose()
    createdAt: true

    @Expose()
    endAt: true

    @Expose()
    title: true

    @Expose()
    todo: true
}