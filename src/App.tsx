import { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, AppBar, Toolbar, IconButton, useMediaQuery, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import OverviewPage from './pages/OverviewPage';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';

const DRAWER_WIDTH = 240;

const navItems = [
  { id: 'overview',  label: 'Обзор',        icon: <DashboardIcon /> },
  { id: 'users',     label: 'Пользователи', icon: <PeopleIcon /> },
  { id: 'products',  label: 'Товары',        icon: <InventoryIcon /> },
  { id: 'orders',    label: 'Заказы',        icon: <ShoppingCartIcon /> },
];

function SidebarContent({ page, onNav }: { page: string; onNav: (p: string) => void }) {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ p: 0.8, borderRadius: 2, background: 'linear-gradient(135deg, #6EE7B7, #34D399)', display: 'flex' }}>
          <AutoAwesomeIcon sx={{ fontSize: 18, color: '#0B0F1A' }} />
        </Box>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.3px' }}>
          Dashboard Pro
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {navItems.map(item => {
          const active = page === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onNav(item.id)}
                sx={{
                  borderRadius: 2.5,
                  py: 1.2,
                  bgcolor: active ? 'rgba(110,231,183,0.1)' : 'transparent',
                  '&:hover': { bgcolor: active ? 'rgba(110,231,183,0.15)' : 'rgba(255,255,255,0.04)' },
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 36,
                  color: active ? '#6EE7B7' : '#64748B',
                  '& svg': { fontSize: 20 }
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.9rem',
                    color: active ? '#F1F5F9' : '#94A3B8',
                  }}
                />
                {active && (
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#6EE7B7' }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.15)' }}>
          <Typography variant="caption" sx={{ color: '#818CF8', display: 'block', fontWeight: 600, mb: 0.3 }}>
            SQLite Database
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
            dashboard.db • Активна
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  const [page, setPage] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const pageMap: Record<string, JSX.Element> = {
    overview: <OverviewPage />,
    users: <UsersPage />,
    products: <ProductsPage />,
    orders: <OrdersPage />,
  };

  const handleNav = (p: string) => {
    setPage(p);
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="fixed" sx={{ bgcolor: '#111827', borderBottom: '1px solid rgba(255,255,255,0.06)', boxShadow: 'none' }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ color: 'text.primary', mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>Dashboard Pro</Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            bgcolor: '#111827',
            border: 'none',
            borderRight: '1px solid rgba(255,255,255,0.06)',
          },
        }}
      >
        <SidebarContent page={page} onNav={handleNav} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          mt: isMobile ? 8 : 0,
          minHeight: '100vh',
          maxWidth: '100%',
          overflow: 'auto',
        }}
      >
        {pageMap[page]}
      </Box>
    </Box>
  );
}
