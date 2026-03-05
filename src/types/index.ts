export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  total: number;
  status: 'pending' | 'shipped' | 'completed' | 'cancelled';
  created_at: string;
  user_name: string;
  product_name: string;
}

export interface StatPoint {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
}

export interface Stats {
  chart: StatPoint[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
  };
}
