import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user.model';
import { TeamService } from './team.service';

@UseGuards(JwtAuthGuard)
@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}
}
