import { IsNumber, IsString } from "class-validator";

export class ModifyCompleteTodoDTO {
    @IsNumber()
    todoId: number;

    @IsString()
    teamId: string;
}