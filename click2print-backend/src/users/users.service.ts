import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class UsersService {
  private FILE = 'users.json';

  constructor(private db: DbService) {}

  getAll() {
    // Ne jamais exposer les mots de passe
    return this.db.readAll(this.FILE).map(({ password, ...u }) => u);
  }

  login(email: string, password: string) {
    const user = this.db.readAll(this.FILE).find(
      u => u.email === email && u.password === password
    );
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');
    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  updateSolde(id: number, montant: number) {
    const user = this.db.findById(this.FILE, id);
    if (!user) return null;
    return this.db.update(this.FILE, id, { solde: user.solde + montant });
  }

  updateRole(id: number, role: string) {
    return this.db.update(this.FILE, id, { role });
  }
}