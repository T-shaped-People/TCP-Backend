import { plainToClass } from '@nestjs/class-transformer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteLinkDTO } from 'src/link/dto/request/delete-link.dto';
import { GetLinkListDTO } from 'src/link/dto/request/get-link-list.dto';
import { UploadLinkDTO } from 'src/link/dto/request/upload-link.dto';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { LinkEntity } from './entities/link.entity';

@Injectable()
export class LinkService {
    
    constructor(@InjectRepository(LinkEntity) private linkRepository: Repository<LinkEntity> ) { }
    
    async getLinkList(dto: GetLinkListDTO): Promise<LinkEntity[]> {
        const { teamId } = dto;
        return this.linkRepository.find({
            where: {
                teamId
            }
        });
    }

    async uploadLink(dto: UploadLinkDTO): Promise<void> {
        const newLink = plainToClass(LinkEntity, dto);
        this.linkRepository.save(newLink);
    }

    async deleteLink(dto: DeleteLinkDTO): Promise<void> {
        const {teamId, id} = dto;
        const link = await this.linkRepository.findOne({
            where: {
                teamId,
                id
            }
        });
        if (!link) throw new NotFoundException('Link not found');
        this.linkRepository.delete(link);
    }
    
}
