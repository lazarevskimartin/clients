import React, { useState } from 'react';
import type { Client } from '../types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

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

interface AddClientModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (client: Omit<Client, '_id'>) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ open, onClose, onAdd }) => {
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [phone, setPhone] = useState('+389');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            fullName,
            address: address + (streetNumber ? ' ' + streetNumber : ''),
            phone,
            status: 'pending',
        });
        setFullName('');
        setAddress('');
        setStreetNumber('');
        setPhone('+389'); // Reset to default
        onClose();
    };

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Додај клиент</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Име и презиме"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Телефон"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Адреса"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        select
                    >
                        {ADDRESS_OPTIONS.map(opt => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Број на улица"
                        value={streetNumber}
                        onChange={e => setStreetNumber(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <DialogActions>
                        <Button onClick={onClose} color="secondary">Откажи</Button>
                        <Button type="submit" variant="contained">Додај</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddClientModal;
