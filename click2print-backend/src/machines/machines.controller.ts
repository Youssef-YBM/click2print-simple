import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { MachinesService } from './machines.service';

@Controller('machines')
export class MachinesController {
  constructor(private machinesService: MachinesService) {}

  // GET /machines
  @Get()
  getAll() {
    return this.machinesService.getAll();
  }

  // GET /machines/:id
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.machinesService.getById(Number(id));
  }

  // PUT /machines/:id/status → { status, progress? }
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; progress?: number }) {
    return this.machinesService.updateStatus(Number(id), body.status, body.progress);
  }
}