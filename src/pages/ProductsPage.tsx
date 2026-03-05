import { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import { api } from '../api';
import { Product } from '../types';

const categoryColors: Record<string, string> = {
  'Электроника': '#6EE7B7',
  'Аксессуары': '#818CF8',
  'Гаджеты': '#FBBF24',
};

const empty = { name: '', category: '', price: '', stock: '' };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<typeof empty>({ ...empty });

  const load = () => api.products.list().then(setProducts);
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    await api.products.create({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) });
    setOpen(false);
    setForm({ ...empty });
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Удалить товар?')) {
      await api.products.delete(id);
      load();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Товары</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Добавить товар
        </Button>
      </Box>

      <Grid container spacing={3}>
        {products.map(product => {
          const catColor = categoryColors[product.category] ?? '#94A3B8';
          return (
            <Grid item xs={12} sm={6} lg={4} key={product.id}>
              <Card sx={{
                height: '100%', display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: `${catColor}18`, display: 'flex' }}>
                      <InventoryIcon sx={{ color: catColor, fontSize: 20 }} />
                    </Box>
                    <Chip label={product.category} size="small" sx={{ bgcolor: `${catColor}18`, color: catColor }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 0.5, fontSize: '1rem' }}>{product.name}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: catColor, mb: 1.5 }}>
                    {product.price.toLocaleString('ru-RU')} ₽
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Остаток:</Typography>
                    <Chip
                      label={`${product.stock} шт.`}
                      size="small"
                      sx={{
                        bgcolor: product.stock > 20 ? 'rgba(110,231,183,0.12)' : 'rgba(251,191,36,0.12)',
                        color: product.stock > 20 ? '#6EE7B7' : '#FBBF24',
                        fontFamily: '"JetBrains Mono"'
                      }}
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                  <Tooltip title="Удалить">
                    <IconButton size="small" onClick={() => handleDelete(product.id)} sx={{ color: '#F87171' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle>Новый товар</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Название" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Категория" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Цена (₽)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Остаток (шт.)" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Отмена</Button>
          <Button variant="contained" onClick={handleSave}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

