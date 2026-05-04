import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DbService } from '../db/db.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DbService],
  exports: [UsersService],
})
export class UsersModule {}