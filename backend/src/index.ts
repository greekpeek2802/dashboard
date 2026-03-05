import express, { Request, Response } from 'express';
import cors from 'cors';
import { loadDb, saveDb } from './database';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

function now(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// ─── USERS ────────────────────────────────────────────────────────────────────

app.get('/api/users', (_req: Request, res: Response) => {
  const db = loadDb();
  res.json([...db.users].reverse());
});

app.post('/api/users', (req: Request, res: Response) => {
  const db = loadDb();
  const { name, email, role, status } = req.body;
  if (db.users.find((u: any) => u.email === email)) {
    return res.status(400).json({ error: 'Email уже используется' });
  }
  db._counters.users++;
  const user = { id: db._counters.users, name, email, role: role || 'user', status: status || 'active', created_at: now() };
  db.users.push(user);
  saveDb(db);
  res.status(201).json(user);
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const db = loadDb();
  const id = parseInt(req.params.id);
  const idx = db.users.findIndex((u: any) => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Не найден' });
  db.users[idx] = { ...db.users[idx], ...req.body };
  saveDb(db);
  res.json(db.users[idx]);
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const db = loadDb();
  const id = parseInt(req.params.id);
  db.users = db.users.filter((u: any) => u.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

app.get('/api/products', (_req: Request, res: Response) => {
  const db = loadDb();
  res.json([...db.products].reverse());
});

app.post('/api/products', (req: Request, res: Response) => {
  const db = loadDb();
  const { name, category, price, stock } = req.body;
  db._counters.products++;
  const product = { id: db._counters.products, name, category, price: parseFloat(price), stock: parseInt(stock), created_at: now() };
  db.products.push(product);
  saveDb(db);
  res.status(201).json(product);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const db = loadDb();
  const id = parseInt(req.params.id);
  db.products = db.products.filter((p: any) => p.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// ─── ORDERS ───────────────────────────────────────────────────────────────────

app.get('/api/orders', (_req: Request, res: Response) => {
  const db = loadDb();
  res.json([...db.orders].reverse());
});

// ─── STATS ────────────────────────────────────────────────────────────────────

app.get('/api/stats', (_req: Request, res: Response) => {
  const db = loadDb();
  const totalRevenue = db.stats.reduce((s: number, r: any) => s + r.revenue, 0);
  res.json({
    chart: db.stats,
    summary: {
      totalRevenue,
      totalOrders: db.orders.length,
      totalUsers: db.users.length,
      totalProducts: db.products.length,
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
