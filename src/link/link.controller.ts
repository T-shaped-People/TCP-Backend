import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetLinkListDTO } from 'src/link/dto/request/get-link-list.dto';
import { LinkEntity } from 'src/link/entities/link.entity';
import { TeamGuard } from 'src/team/team.guard';
import { LinkService } from './link.service';

@UseGuards(TeamGuard)
@UseGuards(JwtAuthGuard)
@Controller('link')
export class LinkController {
    constructor(private readonly linkService: LinkService) {}

    @Get(':teamId') 
    viewCalendar(@Param() dto: GetLinkListDTO): Promise<LinkEntity[]> {
        return this.linkService.getLinkList(dto);
    }
}
