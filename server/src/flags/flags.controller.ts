import { Controller, Get, Query } from '@nestjs/common';
import { FlagsService } from './flags.service';

@Controller('flags')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Get()
  findAll(@Query('level') level?: number) {
    return this.flagsService.findAll(level);
  }
}