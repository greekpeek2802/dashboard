import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip
} from '@mui/material';
import { api } from '../api';
import { Order } from '../types';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Ожидает',   color: '#FBBF24', bg: 'rgba(251,191,36,0.12)' },
  shipped:   { label: 'Отправлен', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
  completed: { label: 'Выполнен',  color: '#6EE7B7', bg: 'rgba(110,231,183,0.12)' },
  cancelled: { label: 'Отменён',   color: '#F87171', bg: 'rgba(248,113,113,0.12)' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => { api.orders.list().then(setOrders); }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Заказы</Typography>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Клиент</TableCell>
                <TableCell>Товар</TableCell>
                <TableCell>Кол-во</TableCell>
                <TableCell>Сумма</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => {
                const s = statusConfig[order.status];
                return (
                  <TableRow key={order.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono"', color: '#64748B' }}>
                        #{String(order.id).padStart(4, '0')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{order.user_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{order.product_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono"' }}>{order.quantity} шт.</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#6EE7B7' }}>
                        {order.total.toLocaleString('ru-RU')} ₽
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{new Date(order.created_at).toLocaleDateString('ru-RU')}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
