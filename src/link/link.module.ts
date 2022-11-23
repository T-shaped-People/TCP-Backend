import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { LinkEntity } from './entities/link.entity';
import { ClassTransformer } from '@nestjs/class-transformer';
import { TeamUtil } from 'src/team/team.util';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkEntity]),
    ClassTransformer,
    TeamModule
  ],
  controllers: [LinkController],
  providers: [
    LinkService,
    TeamUtil
  ]
})
export class LinkModule { }
