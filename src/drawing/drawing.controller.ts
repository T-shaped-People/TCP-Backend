import { Controller } from '@nestjs/common';
import { DrawingService } from './drawing.service';

@Controller('drawing')
export class DrawingController {
    constructor(private readonly drawingService: DrawingService) {}
}
