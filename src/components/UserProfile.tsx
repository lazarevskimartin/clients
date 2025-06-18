import React, { useEffect, useState } from 'react';
import { getProfile } from '../utils/profileApi';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getDeliveries, addDelivery, updateDelivery, deleteDelivery } from '../utils/deliveryApi';
import type { DeliveryRecord } from '../utils/deliveryApi';

// Utility за македонски датум
function formatMacedonianDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('mk-MK', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [records, setRecords] = useState<DeliveryRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formDate, setFormDate] = useState('');
  const [formDelivered, setFormDelivered] = useState<number>(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    getProfile(token)
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
    // Fetch deliveries
    getDeliveries(token)
      .then(res => setRecords(res.data))
      .catch(() => {});
  }, []);

  // Summary
  const totalDelivered = records.reduce((sum, r) => sum + r.delivered, 0);
  const totalMoney = totalDelivered * 40;

  // Modal handlers
  const openAddModal = () => {
    setEditId(null);
    setFormDate('');
    setFormDelivered(0);
    setModalOpen(true);
  };
  const openEditModal = (rec: DeliveryRecord) => {
    setEditId(rec._id);
    setFormDate(rec.date); // use ISO format directly
    setFormDelivered(rec.delivered);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleSave = async () => {
    if (!formDate || formDelivered < 0) return;
    setSaving(true);
    const token = localStorage.getItem('token')!;
    try {
      if (editId) {
        const res = await updateDelivery(token, editId, { date: formDate, delivered: formDelivered });
        setRecords(records.map(r => r._id === editId ? res.data : r));
      } else {
        const res = await addDelivery(token, { date: formDate, delivered: formDelivered });
        setRecords([res.data, ...records]);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };
  const confirmDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem('token')!;
    await deleteDelivery(token, deleteId);
    setRecords(records.filter(r => r._id !== deleteId));
    setDeleteId(null);
  };

  if (loading) return <div>Вчитување профил...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!profile) return null;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '90%', md: '900px' },
        margin: { xs: '24px auto', sm: '32px auto' },
        padding: { xs: '16px', sm: '24px', md: '32px' },
        background: '#fff',
        borderRadius: 3,
        boxShadow: '0 2px 16px #eee',
        minHeight: 400,
        boxSizing: 'border-box',
      }}
    >
      {/* Сѐ во една колона, табелата/картичките се под профилот и резимето на сите екрани */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          alignItems: 'stretch',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Профил и резиме */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography variant="h5" mb={2}>Кориснички профил</Typography>
          <div><strong>Емаил адреса:</strong> {profile.email}</div>
          <div><strong>Создаден:</strong> {new Date(profile.createdAt).toLocaleString()}</div>
          <Box mt={3} mb={2}>
            <Typography variant="h6">Салдо</Typography>
            <div><strong>Вкупно испорачано:</strong> {totalDelivered}</div>
            <div><strong>Вкупно заработка:</strong> {totalMoney} Денари</div>
          </Box>
          <Button variant="contained" color="primary" onClick={openAddModal} sx={{ mb: 2, width: '100%' }}>Додади запис</Button>
        </Box>
        {/* Табела или картички под профилот на сите екрани */}
        <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
          {/* Ако е мобилен или таблет, прикажи картички */}
          {window.innerWidth < 900 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {records.length === 0 && (
                <Paper sx={{ p: 2, textAlign: 'center' }}>Нема запишани испораки.</Paper>
              )}
              {records.map(rec => (
                <Paper key={rec._id} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">Датум</Typography>
                    <Typography>{formatMacedonianDate(rec.date)}</Typography>
                  </Box>
                  <Box sx={{ borderBottom: '1px solid #eee', my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">Пратки:</Typography>
                    <Typography>{rec.delivered}</Typography>
                  </Box>
                  <Box sx={{ borderBottom: '1px solid #eee', my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">Заработка:</Typography>
                    <Typography>{rec.delivered * 40}</Typography>
                  </Box>
                  <Box sx={{ borderBottom: '1px solid #eee', my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                    <IconButton onClick={() => openEditModal(rec)} size="small"><EditIcon fontSize="small" /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(rec._id)} size="small"><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ minWidth: { xs: 320, md: 500 }, width: '100%', maxWidth: '100%' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Датум</TableCell>
                    <TableCell>Пратки</TableCell>
                    <TableCell>Заработка</TableCell>
                    <TableCell>Акции</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map(rec => (
                    <TableRow key={rec._id}>
                      <TableCell>{rec.date}</TableCell>
                      <TableCell>{rec.delivered}</TableCell>
                      <TableCell>{rec.delivered * 40}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => openEditModal(rec)}><EditIcon /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(rec._id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {records.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">Нема запишани испораки.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="xs" PaperProps={{
        sx: {
          width: { xs: '90vw', sm: 340 },
          maxWidth: { xs: '90vw', sm: 340 },
          m: 'auto',
          borderRadius: 2,
          boxSizing: 'border-box',
        }
      }}>
        <DialogTitle>{editId ? 'Измени запис' : 'Додади запис'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, p: 2, pt: 3 }}>
          <TextField
            label="Датум"
            type="date"
            value={formDate}
            onChange={e => setFormDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="Број на испорачани пратки"
            type="number"
            value={formDelivered}
            onChange={e => setFormDelivered(Number(e.target.value))}
            inputProps={{ min: 0 }}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Откажи</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>Зачувај</Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Избриши Запис</DialogTitle>
        <DialogContent>Дали сте сигурни дека сакате да го избришете овој запис?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Откажи</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Избриши</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
