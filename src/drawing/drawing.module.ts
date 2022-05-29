import { Module } from '@nestjs/common';
import { DrawingService } from './drawing.service';
import { DrawingController } from './drawing.controller';
import { DrawingGateway } from './drawing.gateway';

@Module({
  providers: [DrawingService, DrawingGateway],
  controllers: [DrawingController]
})
export class DrawingModule {}
