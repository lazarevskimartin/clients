import UserMenu from './components/UserMenu';
import { useEffect, useState } from 'react';
import ClientCard from './components/ClientCard';
import AddClientModal from './components/AddClientModal';
import ConfirmModal from './components/ConfirmModal';
import Login from './components/Login';
import Register from './components/Register';
import StatusNav from './components/StatusNav';
import UserProfile from './components/UserProfile';
import type { Client } from './types';
import './App.css';
import { Container, AppBar, Toolbar, Typography, IconButton, CircularProgress, Box, Fab, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';

const API_URL = 'https://kurir.crnaovca.mk/api/clients';

const ADDRESS_OPTIONS = [
  'Венијамин Мачуковски',
  'Анастас Митрев',
  'Петар Ацев',
  'Симеон Кавракиров',
  'Кузман Ј. Питу',
  'Васко Карангелески',
  'Јане Сандански',
  'АВНОЈ',
];

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addressFilter, setAddressFilter] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showRegister, setShowRegister] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [search, setSearch] = useState('');
  const [addressFilterOpen, setAddressFilterOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    let url = API_URL;
    if (statusFilter) {
      url = `${API_URL}/status/${statusFilter}`;
    }
    const token = localStorage.getItem('token');
    fetch(url, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setLoading(false);
      });
    // Listen for status change to remove client from list
    const handler = (e: any) => {
      setClients(prev => prev.filter(c => c._id !== e.detail.id));
    };
    window.addEventListener('client-status-changed', handler);
    return () => window.removeEventListener('client-status-changed', handler);
  }, [statusFilter, isLoggedIn]);

  useEffect(() => {
    // Check for JWT token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const showRegisterHandler = () => setShowRegister(true);
    const showLoginHandler = () => setShowRegister(false);
    window.addEventListener('show-register', showRegisterHandler);
    window.addEventListener('show-login', showLoginHandler);
    return () => {
      window.removeEventListener('show-register', showRegisterHandler);
      window.removeEventListener('show-login', showLoginHandler);
    };
  }, []);

  // Set default status filter to 'pending' on login
  useEffect(() => {
    if (isLoggedIn && statusFilter === '') {
      setStatusFilter('pending');
    }
  }, [isLoggedIn, statusFilter]);

  const handleAddClient = async (client: Omit<Client, '_id'>) => {
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(client),
    });
    const newClient = await res.json();
    setClients(prev => [...prev, newClient]);
  };

  const handleDeleteRequest = (id: string | undefined) => {
    setClientToDelete(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/${clientToDelete}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    setClients(prev => prev.filter(client => client._id !== clientToDelete));
    setConfirmOpen(false);
    setClientToDelete(undefined);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.reload();
  };

  // Filter clients by search and address
  const filteredClients = clients.filter(client => {
    // Only show clients matching current status
    if (statusFilter && client.status !== statusFilter) return false;
    // Search by name, phone, or address
    const searchLower = search.toLowerCase();
    return (
      (!searchLower ||
        client.fullName.toLowerCase().includes(searchLower) ||
        client.phone.toLowerCase().includes(searchLower) ||
        client.address.toLowerCase().includes(searchLower)) &&
      (!addressFilter || client.address.startsWith(addressFilter))
    );
  });

  // Sort by ADDRESS_OPTIONS order if all addresses are selected
  let sortedClients: Client[];
  if (!addressFilter) {
    sortedClients = [...filteredClients].sort((a, b) => {
      // Find the index of the address prefix in ADDRESS_OPTIONS
      const getAddressIndex = (address: string) => {
        const found = ADDRESS_OPTIONS.findIndex(opt => address.startsWith(opt));
        return found === -1 ? ADDRESS_OPTIONS.length : found;
      };
      const idxA = getAddressIndex(a.address);
      const idxB = getAddressIndex(b.address);
      if (idxA !== idxB) return idxA - idxB;
      // If same street, sort by street number ascending
      const numA = parseInt((a.address.split(' ').pop() || '').replace(/\D/g, ''), 10);
      const numB = parseInt((b.address.split(' ').pop() || '').replace(/\D/g, ''), 10);
      if (isNaN(numA) && isNaN(numB)) return 0;
      if (isNaN(numA)) return 1;
      if (isNaN(numB)) return -1;
      return numA - numB;
    });
  } else {
    // If filtered, just sort by street number
    sortedClients = [...filteredClients].sort((a, b) => {
      const numA = parseInt((a.address.split(' ').pop() || '').replace(/\D/g, ''), 10);
      const numB = parseInt((b.address.split(' ').pop() || '').replace(/\D/g, ''), 10);
      if (isNaN(numA) && isNaN(numB)) return 0;
      if (isNaN(numA)) return 1;
      if (isNaN(numB)) return -1;
      return numA - numB;
    });
  }

  if (!isLoggedIn) {
    return (
      <div>
        {showRegister ? (
          <>
            <Register />
            <button style={{ margin: 16 }} onClick={() => setShowRegister(false)}>Already have an account? Login</button>
          </>
        ) : (
          <Login />
        )}
      </div>
    );
  }

  if (showProfilePage) {
    return (
      <Container maxWidth="sm" sx={{ p: 0, pb: 7 }}>
        <UserProfile />
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="outlined" onClick={() => setShowProfilePage(false)}>Назад</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ display: { xs: 'block', md: 'flex' }, width: '100vw', minHeight: '100vh', background: '#f8f9fa' }}>
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: 260,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 260, boxSizing: 'border-box', pt: 2, background: '#fff' },
          }}
          open
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton selected={statusFilter === 'delivered'} onClick={() => setStatusFilter('delivered')}>
                <ListItemIcon><CheckCircleIcon color={statusFilter === 'delivered' ? 'success' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="Доставени" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton selected={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')}>
                <ListItemIcon><HourglassEmptyIcon color={statusFilter === 'pending' ? 'warning' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="Во тек" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton selected={statusFilter === 'undelivered'} onClick={() => setStatusFilter('undelivered')}>
                <ListItemIcon><CancelIcon color={statusFilter === 'undelivered' ? 'error' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="Недоставени" />
              </ListItemButton>
            </ListItem>
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ p: 2 }}>
            <UserMenu onProfile={() => setShowProfilePage(true)} onLogout={handleLogout} />
          </Box>
        </Drawer>
      )}
      <Box sx={{ flex: 1, maxWidth: { xs: '100vw', md: 'calc(100vw - 260px)' }, mx: 'auto', p: { xs: 0, md: 4 } }}>
        {/* Top bar for mobile only */}
        {!isDesktop && (
          <AppBar position="static" color="primary" sx={{ mb: 2 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div">
                Пратки
              </Typography>
              <UserMenu onProfile={() => setShowProfilePage(true)} onLogout={handleLogout} />
            </Toolbar>
          </AppBar>
        )}
        {/* Address filter for desktop (chips) */}
        {isDesktop && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', minWidth: 300, mb: 3 }}>
            <Chip
              label="Сите адреси"
              color={addressFilter === '' ? 'primary' : 'default'}
              onClick={() => setAddressFilter('')}
              variant={addressFilter === '' ? 'filled' : 'outlined'}
              clickable
            />
            {ADDRESS_OPTIONS.map(opt => (
              <Chip
                key={opt}
                label={opt}
                color={addressFilter === opt ? 'primary' : 'default'}
                onClick={() => setAddressFilter(opt)}
                variant={addressFilter === opt ? 'filled' : 'outlined'}
                clickable
              />
            ))}
          </Box>
        )}
        {/* Search bar for desktop under address filter */}
        {isDesktop && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SearchIcon sx={{ mr: 1, fontSize: 32 }} />
            <input
              type="text"
              placeholder="Пребарај по име, телефон или адреса..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ccc', fontSize: '1rem', maxWidth: 500 }}
            />
          </Box>
        )}
        {/* Mobile: search and filter in one row */}
        {!isDesktop && (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, mb: 3, px: 1, width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <SearchIcon sx={{ mr: 1, fontSize: 24 }} />
            <input
              type="text"
              placeholder="Пребарај по име, телефон или адреса..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 0, padding: 8, borderRadius: 8, border: '1px solid #ccc', fontSize: '1rem', maxWidth: '100%' }}
            />
            <IconButton sx={{ ml: 1, flexShrink: 0 }} onClick={() => setAddressFilterOpen(open => !open)}>
              <FilterListIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>
        )}
        {/* Address filter popover for mobile only */}
        {!isDesktop && addressFilterOpen && (
          <Box
            onClick={e => e.stopPropagation()}
            sx={{ position: 'fixed', top: 120, left: 0, right: 0, zIndex: 2000, background: '#fff', p: 2, borderRadius: 2, boxShadow: 3, mx: 2 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <strong>Филтер по адреса</strong>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              <Button
                variant={addressFilter === '' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => { setAddressFilter(''); setAddressFilterOpen(false); }}
              >
                Сите адреси
              </Button>
              {ADDRESS_OPTIONS.map(opt => (
                <Button
                  key={opt}
                  variant={addressFilter === opt ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => { setAddressFilter(opt); setAddressFilterOpen(false); }}
                >
                  {opt}
                </Button>
              ))}
            </Box>
          </Box>
        )}
        {/* Client cards grid for desktop, column for mobile */}
        <Box className="client-list" sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr',
            md: '1fr 1fr',
            lg: '1fr 1fr',
            xl: '1fr 1fr 1fr',
            '2xl': '1fr 1fr 1fr 1fr',
            '@media (min-width:1440px)': '1fr 1fr 1fr',
            '@media (min-width:1920px)': '1fr 1fr 1fr 1fr',
          },
          gap: 3,
          px: { xs: 1, md: 0 },
          maxWidth: { md: 1200 },
          mx: { md: 'auto' },
          justifyItems: 'stretch',
          alignItems: 'stretch',
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gridColumn: '1/-1' }}>
              <CircularProgress />
            </Box>
          ) : (
            sortedClients.map(client => (
              <ClientCard key={client._id} client={client} onDelete={handleDeleteRequest} />
            ))
          )}
        </Box>
        <AddClientModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={handleAddClient}
        />
        <ConfirmModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDeleteConfirm}
          message="Дали сте сигурни дека сакате да го избришете овој клиент?"
        />
        {!isDesktop && (
          <StatusNav value={statusFilter} onChange={setStatusFilter} />
        )}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', right: 24, bottom: 80, zIndex: 100 }}
          onClick={() => setModalOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
}

export default App;
