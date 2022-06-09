import { IsNumber, IsString } from "class-validator";

export class DeleteMemberDTO {
    @IsString()
    teamId: string;

    @IsNumber()
    memberCode: number;
}