const BASE = 'https://dashboard-production-7a74.up.railway.app/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(${BASE}${path}, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(HTTP ${res.status});
  return res.json();
}

export const api = {
  users: {
    list: () => request<any[]>('/users'),
    create: (data: any) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request(/users/${id}, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request(/users/${id}, { method: 'DELETE' }),
  },
  products: {
    list: () => request<any[]>('/products'),
    create: (data: any) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: number) => request(/products/${id}, { method: 'DELETE' }),
  },
  orders: {
    list: () => request<any[]>('/orders'),
  },
  stats: {
    get: () => request<any>('/stats'),
  },
};

