import React, { useState } from 'react';
import type { Client } from '../types';
import { Card, CardContent, Typography, Box, Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import SvgIcon from '@mui/material/SvgIcon';
import MapIcon from './MapIcon';
import MapModal from './MapModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';

interface ClientCardProps {
    client: Client;
    onDelete?: (id: string | undefined) => void;
}

const ViberIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.471-.148-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-11.56c-4.45 0-8.072 3.622-8.072 8.072 0 1.422.372 2.81 1.08 4.037l-1.141 4.173 4.272-1.12c1.191.651 2.53 1.003 3.861 1.003h.003c4.45 0 8.072-3.622 8.072-8.072 0-2.157-.841-4.183-2.367-5.709-1.526-1.526-3.552-2.384-5.708-2.384m4.503 12.574c-.2.561-1.164 1.085-1.617 1.162-.453.077-.997.109-1.69-.117-.393-.124-2.591-1.021-4.146-3.188-1.555-2.167-1.38-2.646-1.297-2.773.084-.127.248-.198.497-.347.248-.149.496-.124.67-.099.173.025.272.025.393.223.124.198.446.694.497.792.05.099.083.223.017.347-.066.124-.099.198-.198.322-.099.124-.198.223-.298.347-.099.124-.198.248-.099.446.099.198.446.694.956 1.124.654.582 1.208.765 1.406.849.198.083.322.07.446-.042.124-.111.496-.57.63-.767.133-.198.248-.165.421-.111.173.055 1.096.517 1.282.612.186.095.31.142.356.223.046.082.046.47-.154 1.031m2.225-3.197c-.027-.056-.099-.091-.208-.127-.109-.036-1.273-.25-1.47-.278-.198-.027-.347-.041-.496.056-.149.099-.571.556-.571.556s-.198.248-.272.347c-.074.099-.149.099-.248.074-.099-.025-.496-.198-.946-.63-.35-.312-.588-.698-.658-.797-.069-.099-.007-.153.052-.202.053-.045.119.119.178.198.06.079.08.134.12.223.04.089.02.165-.01.23-.03.065-.267.64-.366.877-.099.238-.199.206-.267.21-.069.004-.148.005-.227.005-.079 0-.206.03-.314.149-.108.119-.413.404-.413.98 0 .576.423 1.134.482 1.212.06.079.833 1.276 2.017 1.74.282.112.502.179.674.229.283.084.541.072.745.044.228-.031.701-.287.8-.565.099-.278.099-.516.069-.565m-3.633-7.255c-3.339 0-6.055 2.716-6.055 6.055 0 .342.035.678.104 1.004.048.234.267.404.505.404.033 0 .067-.003.101-.011.279-.062.456-.34.394-.619-.057-.259-.086-.527-.086-.778 0-2.729 2.221-4.95 4.95-4.95.252 0 .52.029.779.086.28.062.557-.115.619-.394.062-.279-.115-.557-.394-.619a6.13 6.13 0 0 0-1.004-.104m.001 2.02c-2.23 0-4.04 1.81-4.04 4.04 0 .252.023.504.07.75.049.253.29.418.54.37.253-.049.419-.287.37-.54a3.23 3.23 0 0 1-.06-.58c0-1.786 1.453-3.24 3.24-3.24.197 0 .395.02.58.06.253.049.491-.117.54-.37.049-.253-.117-.491-.37-.54a4.13 4.13 0 0 0-.75-.07m.001 2.02c-1.121 0-2.03.91-2.03 2.03 0 .099.008.197.027.292.045.252.285.418.537.373.252-.045.418-.285.373-.537a1.13 1.13 0 0 1-.01-.128c0-.624.507-1.13 1.13-1.13.043 0 .086.003.128.01.252.045.492-.121.537-.373.045-.252-.121-.492-.373-.537a2.03 2.03 0 0 0-.292-.027"/>
  </SvgIcon>
);

const statusIcons = {
  delivered: <CheckCircleIcon color="success" />,
  pending: <HourglassEmptyIcon color="warning" />,
  undelivered: <CancelIcon color="error" />,
};

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
    const [mapOpen, setMapOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [status, setStatus] = useState<'delivered' | 'undelivered' | 'pending'>(client.status || 'pending');

    const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleStatusClose = () => setAnchorEl(null);
    const handleStatusChange = async (newStatus: 'delivered' | 'undelivered' | 'pending') => {
      setStatus(newStatus);
      setAnchorEl(null);
      // Call API to update status
      await fetch(`/api/clients/${client._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      // Remove from UI if status changes (for filtered views)
      if (client.status !== newStatus) {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('client-status-changed', { detail: { id: client._id, status: newStatus } }));
        }
      }
    };

    return (
        <Card sx={{ mt: 2, background: 'background.paper', borderRadius: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" className="client-name">
                        {client.fullName}
                    </Typography>
                    <IconButton
                        aria-label="Open in Maps"
                        sx={{ ml: 1, color: 'black' }}
                        onClick={() => setMapOpen(true)}
                    >
                        <MapIcon />
                    </IconButton>
                </Box>
                <Typography variant="body2" className="client-address">
                    {client.address}
                </Typography>
                <Typography variant="body2" className="client-phone">
                    {client.phone}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<PhoneIcon />}
                        href={`tel:${client.phone}`}
                        sx={{ flex: 1 }}
                    >
                        Јави се
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ flex: 1, background: '#7360f2', '&:hover': { background: '#5e4db2' } }}
                        href={`viber://chat?number=%2B${client.phone.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        endIcon={<ViberIcon />}
                    >
                        Пиши на
                    </Button>
                    {onDelete && (
                        <IconButton sx={{ color: 'black' }} onClick={() => onDelete(client._id)}>
                            <DeleteIcon />
                        </IconButton>
                    )}
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
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleStatusClose}
                    PaperProps={{
                      sx: {
                        borderRadius: 2,
                        minWidth: 180,
                        boxShadow: 3,
                        p: 1,
                      },
                    }}
                  >
                    <MenuItem onClick={() => handleStatusChange('delivered')} sx={{ borderRadius: 1 }}>
                      <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Доставена" />
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusChange('pending')} sx={{ borderRadius: 1 }}>
                      <ListItemIcon><HourglassEmptyIcon color="warning" /></ListItemIcon>
                      <ListItemText primary="Во тек" />
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusChange('undelivered')} sx={{ borderRadius: 1 }}>
                      <ListItemIcon><CancelIcon color="error" /></ListItemIcon>
                      <ListItemText primary="Недоставена" />
                    </MenuItem>
                  </Menu>
                </Box>
                <MapModal open={mapOpen} onClose={() => setMapOpen(false)} address={client.address || ''} />
            </CardContent>
        </Card>
    );
};

export default ClientCard;
