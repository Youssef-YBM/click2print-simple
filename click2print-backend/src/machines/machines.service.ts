import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class MachinesService {
  private FILE = 'machines.json';

  constructor(private db: DbService) {}

  getAll() {
    return this.db.readAll(this.FILE);
  }

  getById(id: number) {
    return this.db.findById(this.FILE, id);
  }

  updateStatus(id: number, status: string, progress?: number) {
    const updates: any = { status };
    if (progress !== undefined) updates.progress = progress;
    return this.db.update(this.FILE, id, updates);
  }
}