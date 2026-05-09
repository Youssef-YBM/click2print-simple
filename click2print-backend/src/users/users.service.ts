import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class UsersService {
  private FILE = 'users.json';

  constructor(private db: DbService) { }

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

  register(name: string, email: string, password: string) {
    const users = this.db.readAll(this.FILE)

    // Vérifier si l'email existe déjà
    if (users.find(u => u.email === email)) {
      throw new Error('Cet email est déjà utilisé')
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1

    const newUser = {
      id: newId,
      name,
      email,
      password, // A terme, hasher avec bcrypt
      role: 'client',
      solde: 0,
      avatar: name.charAt(0).toUpperCase(),
      createdAt: new Date().toISOString().split('T')[0]
    }

    this.db.create(this.FILE, newUser)

    const { password: _, ...safeUser } = newUser
    return safeUser
  }
}