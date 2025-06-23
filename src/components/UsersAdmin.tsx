import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { User, UserRole } from '../types';

const API_URL = '/api/users';

const UsersAdmin: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch {
      setError('Грешка при вчитување корисници');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id: string, role: UserRole) => {
    setSavingId(id);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      setUsers(users => users.map(u => u._id === id ? { ...u, role } : u));
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Дали сте сигурни дека сакате да го избришете овој корисник?')) return;
    setSavingId(id);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setUsers(users => users.filter(u => u._id !== id));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: '32px auto', background: '#fff', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" mb={2}>Менаџирање на корисници</Typography>
      {loading ? <div>Вчитување...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Улога</TableCell>
                <TableCell>Акции</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <FormControl size="small" variant="standard">
                      <InputLabel>Улога</InputLabel>
                      <Select
                        value={user.role}
                        onChange={e => handleRoleChange(user._id!, e.target.value as UserRole)}
                        disabled={savingId === user._id}
                        label="Улога"
                      >
                        <MenuItem value="admin">Админ</MenuItem>
                        <MenuItem value="operator">Оператор</MenuItem>
                        <MenuItem value="courier">Курир</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(user._id!)} disabled={savingId === user._id}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Button onClick={onClose} sx={{ mt: 2 }}>Затвори</Button>
    </Box>
  );
};

export default UsersAdmin;
