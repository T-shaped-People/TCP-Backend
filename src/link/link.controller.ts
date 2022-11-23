import { Controller, UseGuards, Get, Param, Post, Body, Delete } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { DeleteLinkDTO } from 'src/link/dto/request/delete-link.dto';
import { GetLinkListDTO } from 'src/link/dto/request/get-link-list.dto';
import { UploadLinkDTO } from 'src/link/dto/request/upload-link.dto';
import { LinkEntity } from 'src/link/entities/link.entity';
import { TeamGuard } from 'src/team/team.guard';
import { LinkService } from './link.service';

@UseGuards(TeamGuard)
@UseGuards(JwtAuthGuard)
@Controller('link')
export class LinkController {
    constructor(private readonly linkService: LinkService) {}

    @Get(':teamId')
    getLinkList(@Param() dto: GetLinkListDTO): Promise<LinkEntity[]> {
        return this.linkService.getLinkList(dto);
    }
    
    @Post()
    uploadLink(@Body() dto: UploadLinkDTO) {
        this.linkService.uploadLink(dto);
    }

    @Delete(':teamId/:id')
    deleteLink(@Param() dto: DeleteLinkDTO): Promise<void> {
        return this.linkService.deleteLink(dto);
    }
}
