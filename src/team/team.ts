import { Expose } from "@nestjs/class-transformer";

export class Team {
    @Expose()
    id: string;

    @Expose()
    leaderId: number;

    @Expose()
    name: string;
}
