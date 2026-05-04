import { Module, Controller, Get } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Controller('materials')
class MaterialsController {
  constructor(private db: DbService) {}

  @Get()
  getAll() {
    return this.db.readAll('materials.json');
  }
}

@Module({
  controllers: [MaterialsController],
  providers: [DbService],
})
export class MaterialsModule {}