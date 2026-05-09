import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  // GET /users → tous les utilisateurs (sans password)
  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  // POST /users/login → { email, password }
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body.email, body.password);
  }

  // PUT /users/:id/solde → { montant }
  @Put(':id/solde')
  updateSolde(@Param('id') id: string, @Body() body: { montant: number }) {
    return this.usersService.updateSolde(Number(id), body.montant);
  }

  // PUT /users/:id/role → { role }
  @Put(':id/role')
  updateRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.usersService.updateRole(Number(id), body.role);
  }
  // POST /users/register → { name, email, password }
  @Post('register')
  register(@Body() body: { name: string; email: string; password: string }) {
    return this.usersService.register(body.name, body.email, body.password);
  }

}