import { Module } from '@nestjs/common';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { DbService } from '../db/db.service';

@Module({
  controllers: [MachinesController],
  providers: [MachinesService, DbService],
})
export class MachinesModule {}