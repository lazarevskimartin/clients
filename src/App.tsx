import { useEffect, useState } from 'react';
import ClientCard from './components/ClientCard';
import AddClientModal from './components/AddClientModal';
import ConfirmModal from './components/ConfirmModal';
import Login from './components/Login';
import type { Client } from './types';
import './App.css';
import { Container, AppBar, Toolbar, Typography, IconButton, Select, MenuItem, CircularProgress, Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'https://kurir.crnaovca.mk/api/clients';

const ADDRESS_OPTIONS = [
  'Венјамин Манџуковски',
  'Анастас Митрев',
  'Петар Ацев',
  'Симеон Кавракиров',
  'Кузман Ј. Питу',
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
  const [loginError, setLoginError] = useState<string | undefined>(undefined);

  const USERS = [
    { username: 'martin', password: 'Macki2000*' },
    { username: 'ana', password: 'Ana2000*' },
    { username: 'georg', password: 'Goga2000*' },
  ];

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setLoading(false);
      });
  }, []);

  const handleAddClient = async (client: Omit<Client, '_id'>) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    await fetch(`${API_URL}/${clientToDelete}`, { method: 'DELETE' });
    setClients(prev => prev.filter(client => client._id !== clientToDelete));
    setConfirmOpen(false);
    setClientToDelete(undefined);
  };

  const handleLogin = (username: string, password: string) => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      setIsLoggedIn(true);
      setLoginError(undefined);
    } else {
      setLoginError('Погрешно корисничко име или лозинка');
    }
  };

  const filteredClients = addressFilter
    ? clients.filter(client => client.address.startsWith(addressFilter))
    : clients;

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
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <Container maxWidth="sm" sx={{ p: 0 }}>
      <AppBar position="static" color="primary" sx={{ mb: 2 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Пратки
          </Typography>
          <IconButton color="inherit" onClick={() => setModalOpen(true)} size="large">
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ mb: 2, px: 1 }}>
        <Select
          fullWidth
          displayEmpty
          value={addressFilter}
          onChange={e => setAddressFilter(e.target.value)}
          sx={{ background: '#fff', borderRadius: 2, px: 1 }}
        >
          <MenuItem value="">Сите адреси</MenuItem>
          {ADDRESS_OPTIONS.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box className="client-list" sx={{ px: 1 }}>
          {sortedClients.map(client => (
            <ClientCard key={client._id} client={client} onDelete={handleDeleteRequest} />
          ))}
        </Box>
      )}
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
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', right: 24, bottom: 40, zIndex: 100 }}
        onClick={() => setModalOpen(true)}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default App;
