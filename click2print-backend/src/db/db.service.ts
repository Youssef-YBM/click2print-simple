import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DbService {
  private getPath(filename: string): string {
    return path.join(process.cwd(), 'data', filename);
  }

  readAll(filename: string): any[] {
    const content = fs.readFileSync(this.getPath(filename), 'utf-8');
    return JSON.parse(content);
  }

  writeAll(filename: string, data: any[]): void {
    fs.writeFileSync(this.getPath(filename), JSON.stringify(data, null, 2), 'utf-8');
  }

  findById(filename: string, id: number): any {
    return this.readAll(filename).find(item => item.id === id) || null;
  }

  create(filename: string, item: any): any {
    const data = this.readAll(filename);
    const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
    const newItem = { id: newId, ...item };
    data.push(newItem);
    this.writeAll(filename, data);
    return newItem;
  }

  update(filename: string, id: number, updates: any): any {
    const data = this.readAll(filename);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updates };
    this.writeAll(filename, data);
    return data[index];
  }

  delete(filename: string, id: number): boolean {
    const data = this.readAll(filename);
    const filtered = data.filter(item => item.id !== id);
    if (filtered.length === data.length) return false;
    this.writeAll(filename, filtered);
    return true;
  }
}