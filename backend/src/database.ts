import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../data/db.json');

export interface DbSchema {
  users: any[];
  products: any[];
  orders: any[];
  stats: any[];
  _counters: { users: number; products: number; orders: number; stats: number };
}

export function loadDb(): DbSchema {
  if (!fs.existsSync(DB_PATH)) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const initial = seedData();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

export function saveDb(db: DbSchema): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function now(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

function seedData(): DbSchema {
  const db: DbSchema = {
    users: [], products: [], orders: [], stats: [],
    _counters: { users: 0, products: 0, orders: 0, stats: 0 }
  };

  const addUser = (name: string, email: string, role: string, status: string) => {
    db._counters.users++;
    db.users.push({ id: db._counters.users, name, email, role, status, created_at: now() });
  };
  addUser('Алексей Иванов', 'alex@example.com', 'admin', 'active');
  addUser('Мария Смирнова', 'maria@example.com', 'user', 'active');
  addUser('Дмитрий Петров', 'dmitry@example.com', 'manager', 'active');
  addUser('Анна Козлова', 'anna@example.com', 'user', 'inactive');
  addUser('Сергей Новиков', 'sergey@example.com', 'user', 'active');

  const addProduct = (name: string, category: string, price: number, stock: number) => {
    db._counters.products++;
    db.products.push({ id: db._counters.products, name, category, price, stock, created_at: now() });
  };
  addProduct('Ноутбук Pro 15', 'Электроника', 89999, 25);
  addProduct('Беспроводные наушники', 'Аксессуары', 12500, 80);
  addProduct('Умные часы X3', 'Гаджеты', 24990, 45);
  addProduct('Механическая клавиатура', 'Аксессуары', 8990, 60);
  addProduct('Монитор 27" 4K', 'Электроника', 54990, 15);

  const addOrder = (user_id: number, product_id: number, quantity: number, total: number, status: string) => {
    db._counters.orders++;
    const user = db.users.find((u: any) => u.id === user_id);
    const product = db.products.find((p: any) => p.id === product_id);
    db.orders.push({
      id: db._counters.orders, user_id, product_id, quantity, total, status,
      user_name: user?.name, product_name: product?.name, created_at: now()
    });
  };
  addOrder(1, 1, 1, 89999, 'completed');
  addOrder(2, 2, 2, 25000, 'completed');
  addOrder(3, 3, 1, 24990, 'pending');
  addOrder(4, 4, 1, 8990, 'shipped');
  addOrder(5, 5, 1, 54990, 'completed');
  addOrder(1, 2, 1, 12500, 'pending');

  const months  = ['2025-09','2025-10','2025-11','2025-12','2026-01','2026-02'];
  const revenues = [320000, 480000, 550000, 710000, 430000, 620000];
  const orders   = [42, 67, 78, 95, 58, 84];
  const visitors = [1200, 1850, 2100, 2800, 1600, 2300];
  months.forEach((date, i) => {
    db._counters.stats++;
    db.stats.push({ id: db._counters.stats, date, revenue: revenues[i], orders: orders[i], visitors: visitors[i] });
  });

  return db;
}
