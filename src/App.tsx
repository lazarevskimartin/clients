import { useEffect, useState } from 'react';
import ClientCard from './components/ClientCard';
import AddClientModal from './components/AddClientModal';
import ConfirmModal from './components/ConfirmModal';
import Login from './components/Login';
import type { Client } from './types';
import './App.css';

const API_URL = '/api/clients';

const ADDRESS_OPTIONS = [
  'В. Манџуковски',
  'Анастас Митрев',
  'Петар Ацев',
  'Симеон Кавракиров',
  'К. Ј. Питу',
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
      setLoginError('Invalid username or password');
    }
  };

  const filteredClients = addressFilter
    ? clients.filter(client => client.address.startsWith(addressFilter))
    : clients;

  // Sort by street number ascending if present
  const sortedClients = [...filteredClients].sort((a, b) => {
    // Extract street number (last part after space)
    const numA = parseInt((a.address.split(' ').pop() || '').replace(/\D/g, ''), 10);
    const numB = parseInt((b.address.split(' ').pop() || '').replace(/\D/g, ''), 10);
    if (isNaN(numA) && isNaN(numB)) return 0;
    if (isNaN(numA)) return 1;
    if (isNaN(numB)) return -1;
    return numA - numB;
  });

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">Пратки</h1>
        <button className="add-top-btn" onClick={() => setModalOpen(true)}>
          +
        </button>
      </div>
      <div className="address-filter-container">
        <select
          className="address-filter"
          value={addressFilter}
          onChange={e => setAddressFilter(e.target.value)}
        >
          <option value="">Сите адреси</option>
          {ADDRESS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="client-list">
          {sortedClients.map(client => (
            <ClientCard key={client._id} client={client} onDelete={handleDeleteRequest} />
          ))}
        </div>
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
    </div>
  );
}

export default App;
