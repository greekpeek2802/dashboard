import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Grid, Tooltip, Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../api';
import { User } from '../types';

const roleColors: Record<string, 'error' | 'warning' | 'default'> = {
  admin: 'error', manager: 'warning', user: 'default'
};
const roleLabels: Record<string, string> = { admin: 'Админ', manager: 'Менеджер', user: 'Пользователь' };

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function avatarColor(name: string) {
  const colors = ['#6EE7B7', '#818CF8', '#FBBF24', '#F87171', '#60A5FA'];
  return colors[name.charCodeAt(0) % colors.length];
}

const empty = { name: '', email: '', role: 'user', status: 'active' };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<typeof empty>({ ...empty });

  const load = () => api.users.list().then(setUsers);
  useEffect(() => { load(); }, []);

  const handleOpen = (user?: User) => {
    setEditing(user ?? null);
    setForm(user ? { name: user.name, email: user.email, role: user.role, status: user.status } : { ...empty });
    setOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      await api.users.update(editing.id, form);
    } else {
      await api.users.create(form);
    }
    setOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Удалить пользователя?')) {
      await api.users.delete(id);
      load();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Пользователи</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Добавить
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Пользователь</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата регистрации</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: avatarColor(user.name), color: '#0B0F1A', fontSize: '0.8rem', fontWeight: 700 }}>
                        {initials(user.name)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono"', color: 'text.secondary' }}>{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={roleLabels[user.role]} color={roleColors[user.role]} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status === 'active' ? 'Активен' : 'Неактивен'}
                      size="small"
                      sx={{
                        bgcolor: user.status === 'active' ? 'rgba(110,231,183,0.12)' : 'rgba(248,113,113,0.12)',
                        color: user.status === 'active' ? '#6EE7B7' : '#F87171',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{new Date(user.created_at).toLocaleDateString('ru-RU')}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Редактировать">
                      <IconButton size="small" onClick={() => handleOpen(user)} sx={{ color: '#818CF8' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton size="small" onClick={() => handleDelete(user.id)} sx={{ color: '#F87171' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle>{editing ? 'Редактировать пользователя' : 'Новый пользователь'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Имя" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Роль</InputLabel>
                <Select value={form.role} label="Роль" onChange={e => setForm({ ...form, role: e.target.value })}>
                  <MenuItem value="admin">Администратор</MenuItem>
                  <MenuItem value="manager">Менеджер</MenuItem>
                  <MenuItem value="user">Пользователь</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Статус</InputLabel>
                <Select value={form.status} label="Статус" onChange={e => setForm({ ...form, status: e.target.value })}>
                  <MenuItem value="active">Активен</MenuItem>
                  <MenuItem value="inactive">Неактивен</MenuItem>
                </Select>
              </FormControl>
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
