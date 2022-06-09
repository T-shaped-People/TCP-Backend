import { Expose } from "@nestjs/class-transformer";

export class Chat {
    @Expose()
    id: number;

    @Expose()
    deleted: boolean;

    @Expose()
    usercode: number;

    @Expose()
    nickname: string;

    @Expose()
    date: Date;

    @Expose()
    content: string;
}