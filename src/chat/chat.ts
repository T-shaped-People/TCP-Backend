import { Expose } from "@nestjs/class-transformer";
import { Exclude } from "class-transformer";

export class Chat {
    @Expose()
    id: number;

    @Exclude()
    roomId?: string;

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