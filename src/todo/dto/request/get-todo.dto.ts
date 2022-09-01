import { IsDate, IsString } from "class-validator";

export class GetTodoDTO {
    @IsString()
    teamId: string;
}