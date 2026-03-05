import { useEffect, useState } from 'react';
import {
  Grid, Paper, Typography, Box, Skeleton, Chip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import { api } from '../api';
import { Stats } from '../types';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <Paper sx={{ p: 3, height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{
        position: 'absolute', top: -20, right: -20, width: 100, height: 100,
        borderRadius: '50%', background: color, opacity: 0.08
      }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>{title}</Typography>
          <Typography variant="h4" sx={{ fontSize: '1.8rem', fontWeight: 700 }}>{value}</Typography>
          {trend && (
            <Chip label={trend} size="small" sx={{ mt: 1, bgcolor: 'rgba(110,231,183,0.12)', color: '#6EE7B7', height: 22 }} />
          )}
        </Box>
        <Box sx={{
          p: 1.5, borderRadius: 3, background: color,
          display: 'flex', alignItems: 'center', color: '#0B0F1A'
        }}>
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

function SimpleBarChart({ data }: { data: Stats['chart'] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>Выручка по месяцам</Typography>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 160 }}>
        {data.map((d) => {
          const height = (d.revenue / max) * 140;
          return (
            <Box key={d.date} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#6EE7B7', fontSize: '0.65rem' }}>
                {(d.revenue / 1000).toFixed(0)}k
              </Typography>
              <Box sx={{
                width: '100%', height, borderRadius: '6px 6px 2px 2px',
                background: 'linear-gradient(180deg, #6EE7B7, #34D399)',
                minHeight: 4, transition: 'height 0.3s ease',
                '&:hover': { opacity: 0.85 }
              }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#64748B' }}>
                {d.date.slice(5)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function OrdersLineChart({ data }: { data: Stats['chart'] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.orders));
  const min = Math.min(...data.map(d => d.orders));
  const W = 400, H = 120, PAD = 20;
  const points = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((d.orders - min) / (max - min || 1)) * (H - PAD * 2);
    return { x, y, ...d };
  });
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>Заказы по месяцам</Typography>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 120 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path d={pathD} fill="none" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#818CF8" stroke="#111827" strokeWidth="2" />
        ))}
      </svg>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        {data.map(d => (
          <Typography key={d.date} variant="caption" sx={{ fontSize: '0.65rem', color: '#64748B' }}>{d.date.slice(5)}</Typography>
        ))}
      </Box>
    </Box>
  );
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stats.get().then(setStats).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => n?.toLocaleString('ru-RU') ?? '–';

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Обзор</Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          {
            title: 'Общая выручка',
            value: loading ? '–' : `${fmt(stats?.summary.totalRevenue ?? 0)} ₽`,
            icon: <TrendingUpIcon />, color: '#6EE7B7', trend: '+18% за квартал'
          },
          {
            title: 'Всего заказов',
            value: loading ? '–' : fmt(stats?.summary.totalOrders ?? 0),
            icon: <ShoppingCartIcon />, color: '#818CF8', trend: '+12 в этом месяце'
          },
          {
            title: 'Пользователей',
            value: loading ? '–' : fmt(stats?.summary.totalUsers ?? 0),
            icon: <PeopleIcon />, color: '#FBBF24', trend: 'Активных: 4'
          },
          {
            title: 'Товаров',
            value: loading ? '–' : fmt(stats?.summary.totalProducts ?? 0),
            icon: <InventoryIcon />, color: '#F87171', trend: 'В каталоге'
          },
        ].map((card, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            {loading
              ? <Skeleton variant="rounded" height={120} />
              : <StatCard {...card} />
            }
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper>
            {loading ? <Skeleton variant="rounded" height={220} /> : <SimpleBarChart data={stats?.chart ?? []} />}
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper>
            {loading ? <Skeleton variant="rounded" height={220} /> : <OrdersLineChart data={stats?.chart ?? []} />}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
