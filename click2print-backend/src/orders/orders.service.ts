import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

// Prix des matériaux (mirror de data.json)
const MATERIAL_PRICES: Record<string, number> = {
  PLA: 50,
  PETG: 70,
  ABS: 65,
  Résine: 120,
};

@Injectable()
export class OrdersService {
  private FILE = 'orders.json';
  private USERS_FILE = 'users.json';

  constructor(private db: DbService) {}

  getAll() {
    return this.db.readAll(this.FILE);
  }

  getByUser(userId: number) {
    return this.db.readAll(this.FILE).filter(o => o.userId === userId);
  }

  getById(id: number) {
    return this.db.findById(this.FILE, id);
  }

  create(userId: number, data: any) {
    const price = MATERIAL_PRICES[data.material] * data.quantity;

    // Vérifier et déduire le solde
    const user = this.db.findById(this.USERS_FILE, userId);
    if (!user) throw new Error('Utilisateur non trouvé');
    if (user.solde < price) throw new Error('Solde insuffisant');

    this.db.update(this.USERS_FILE, userId, { solde: user.solde - price });

    const newOrder = {
      userId,
      fileName: data.fileName,
      material: data.material,
      color: data.color,
      quantity: data.quantity,
      notes: data.notes || '',
      price,
      status: 'pending',
      machineId: null,
      date: new Date().toISOString().split('T')[0],
    };
    return this.db.create(this.FILE, newOrder);
  }

  updateStatus(id: number, status: string) {
    return this.db.update(this.FILE, id, { status });
  }

  assignMachine(orderId: number, machineId: number) {
    // Mettre à jour la commande
    const order = this.db.update(this.FILE, orderId, { machineId, status: 'printing' });
    // Mettre à jour la machine
    this.db.update('machines.json', machineId, { status: 'printing' });
    return order;
  }

  delete(id: number) {
    return this.db.delete(this.FILE, id);
  }
}