import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { MachinesModule } from './machines/machines.module';
import { MaterialsModule } from './materials/materials.module';

@Module({
  imports: [UsersModule, OrdersModule, MachinesModule, MaterialsModule],
})
export class AppModule {}