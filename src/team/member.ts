import { Expose } from "@nestjs/class-transformer";

export class Member {
    @Expose()
    teamId: string;

    @Expose()
    usercode: number;

    @Expose()
    nickname: string
}
