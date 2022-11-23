import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetLinkListDTO } from 'src/link/dto/request/get-link-list.dto';
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
    
}
