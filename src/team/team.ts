import { Expose } from "@nestjs/class-transformer";

export class Team {
    @Expose()
    id: string;

    @Expose()
    leaderId: number;

    @Expose()
    leaderNickname: string;

    @Expose()
    name: string;

    @Expose()
    totalMembers: number;
}
