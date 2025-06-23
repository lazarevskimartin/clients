import React, { useState } from 'react';
import type { Client } from '../types';
import { Card, CardContent, Typography, Box, Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from './MapIcon';
import MapModal from './MapModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import CallIcon from '@mui/icons-material/Call';
import ChatIcon from '@mui/icons-material/Chat';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

interface ClientCardProps {
    client: Client;
    onDelete?: (id: string | undefined) => void;
    onEdit?: () => void;
}

const statusIcons = {
  delivered: <CheckCircleIcon color="success" />,
  pending: <HourglassEmptyIcon color="warning" />,
  undelivered: <CancelIcon color="error" />,
};

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete, onEdit }) => {
    const [mapOpen, setMapOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [status, setStatus] = useState<'delivered' | 'undelivered' | 'pending'>(client.status || 'pending');
    const [note, setNote] = useState<string>(client.note || '');
    const [noteModalOpen, setNoteModalOpen] = useState(false);

    const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleStatusClose = () => setAnchorEl(null);
    const handleStatusChange = async (newStatus: 'delivered' | 'undelivered' | 'pending') => {
      setAnchorEl(null);
      if (newStatus === 'undelivered') {
        setStatus(newStatus);
        setNoteModalOpen(true);
        return;
      }
      setStatus(newStatus);
      setNote('');
      const token = localStorage.getItem('token');
      await fetch(`/api/clients/${client._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus, note: '' }),
      });
      // Remove from UI if status changes (for filtered views)
      if (client.status !== newStatus) {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('client-status-changed', { detail: { id: client._id, status: newStatus } }));
        }
      }
    };
    const handleNoteSave = async () => {
      setNoteModalOpen(false);
      const token = localStorage.getItem('token');
      await fetch(`/api/clients/${client._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status, note }),
      });
      if (client.status !== status) {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('client-status-changed', { detail: { id: client._id, status } }));
        }
      }
    };

    return (
        <Card className="client-card" sx={{ position: 'relative' }}>
            {/* Edit/Delete icons top right */}
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1, zIndex: 2 }}>
                <IconButton size="small" color="primary" onClick={onEdit} aria-label="Измени клиент">
                    <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => onDelete && onDelete(client._id)} aria-label="Избриши клиент">
                    <DeleteIcon />
                </IconButton>
            </Box>
            <CardContent>
                <Typography variant="h6" className="client-name">
                    {client.fullName}
                </Typography>
                <Typography variant="body2" className="client-address">
                    {client.address}
                </Typography>
                <Typography variant="body2" className="client-phone">
                    {client.phone}
                </Typography>
                {/* Call, Viber, Map icons above status */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1, mt: 2 }}>
                    <IconButton
                        aria-label="Јави се"
                        color="success"
                        href={`tel:${client.phone}`}
                        component="a"
                    >
                        <CallIcon />
                    </IconButton>
                    <IconButton
                        aria-label="Пиши на Viber"
                        sx={{ color: '#7360f2' }}
                        href={`viber://chat?number=%2B${client.phone.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        component="a"
                    >
                        <ChatIcon />
                    </IconButton>
                    <IconButton
                        aria-label="Open in Maps"
                        sx={{ color: 'black' }}
                        onClick={() => setMapOpen(true)}
                    >
                        <MapIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <IconButton
                    onClick={handleStatusClick}
                    sx={{
                      color: 'black',
                      mr: 1,
                      background: '#f5f5f5',
                      borderRadius: 2,
                      boxShadow: 1,
                      border: '1px solid #e0e0e0',
                      transition: 'background 0.2s',
                      '&:hover': {
                        background: '#e0e0e0',
                        color: '#1976d2',
                      },
                      p: 1.2,
                    }}
                  >
                    {statusIcons[status]}
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      color: status === 'delivered' ? 'success.main' : status === 'undelivered' ? 'error.main' : 'warning.main',
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      ml: 0.5,
                      fontSize: '1rem',
                    }}
                  >
                    {status === 'delivered' ? 'Доставена' : status === 'undelivered' ? 'Недоставена' : 'Во тек'}
                  </Typography>
                  {/* Note icon for editing/adding description for any status */}
                  <IconButton
                    aria-label="Додај/измени опис"
                    sx={{ ml: 1, color: '#b26a00' }}
                    onClick={() => setNoteModalOpen(true)}
                  >
                    <NoteAltIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleStatusClose}
                  >
                    <MenuItem onClick={() => handleStatusChange('delivered')}>
                      <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Доставена" />
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusChange('undelivered')}>
                      <ListItemIcon><CancelIcon color="error" /></ListItemIcon>
                      <ListItemText primary="Недоставена" />
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusChange('pending')}>
                      <ListItemIcon><HourglassEmptyIcon color="warning" /></ListItemIcon>
                      <ListItemText primary="Во тек" />
                    </MenuItem>
                  </Menu>
                  {/* Модал за опис на недоставена */}
                  <Dialog open={noteModalOpen} onClose={() => setNoteModalOpen(false)} maxWidth="xs" fullWidth>
                    <DialogTitle>Опис за статус</DialogTitle>
                    <DialogContent>
                      <TextField
                        label="Опис за статусот (опционално)"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                        autoFocus
                        sx={{ pt: 2 }}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setNoteModalOpen(false)}>Откажи</Button>
                      <Button onClick={handleNoteSave} variant="contained">Зачувај</Button>
                    </DialogActions>
                  </Dialog>
                </Box>
                <MapModal open={mapOpen} onClose={() => setMapOpen(false)} address={client.address || ''} />
                {/* Прикажи опис за сите статуси ако постои */}
                {note && (
                  <Box sx={{ mt: 1, p: 1, background: '#fff3e0', borderRadius: 1, fontSize: '0.95rem', color: '#b26a00' }}>
                    <strong>Опис:</strong> {note}
                  </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ClientCard;
