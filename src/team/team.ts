import { Expose } from "@nestjs/class-transformer";

export class Team {
    @Expose()
    id: string;

    @Expose()
    leader: number;

    @Expose()
    name: string;
}
