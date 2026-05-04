import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // GET /orders → toutes les commandes
  // GET /orders?userId=2 → commandes d'un user
  @Get()
  getAll(@Query('userId') userId?: string) {
    if (userId) return this.ordersService.getByUser(Number(userId));
    return this.ordersService.getAll();
  }

  // GET /orders/:id
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.ordersService.getById(Number(id));
  }

  // POST /orders → { userId, fileName, material, color, quantity, notes }
  @Post()
  create(@Body() body: any) {
    return this.ordersService.create(body.userId, body);
  }

  // PUT /orders/:id/status → { status }
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(Number(id), body.status);
  }

  // PUT /orders/:id/assign → { machineId }
  @Put(':id/assign')
  assignMachine(@Param('id') id: string, @Body() body: { machineId: number }) {
    return this.ordersService.assignMachine(Number(id), body.machineId);
  }

  // DELETE /orders/:id
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ordersService.delete(Number(id));
  }
}