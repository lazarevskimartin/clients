import React, { useState } from 'react';
import type { Client } from '../types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, InputAdornment } from '@mui/material';

const ADDRESS_OPTIONS = [
    'Венијамин Мачуковски',
    'Анастас Митрев',
    'Петар Ацев',
    'Симеон Кавракиров',
    'Кузман Ј. Питу',
    'Васко Карангелески',
    'Јане Сандански',
    'АВНОЈ',
    '3-та Македонска Бригада',
    'Владимир Комаров',
    'Бојмија'
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
    const [phoneSuffix, setPhoneSuffix] = useState(''); // само бројки после +389

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // дозволи само бројки
        const value = e.target.value.replace(/\D/g, '');
        setPhoneSuffix(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            fullName,
            address: address + (streetNumber ? ' ' + streetNumber : ''),
            phone: '+389' + phoneSuffix,
            status: 'pending',
        });
        setFullName('');
        setAddress('');
        setStreetNumber('');
        setPhoneSuffix('');
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
                        value={phoneSuffix}
                        onChange={handlePhoneChange}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: <InputAdornment position="start">+389</InputAdornment>,
                            inputMode: 'numeric',
                        }}
                        inputProps={{
                            maxLength: 8, // макс 8 цифри после +389
                            pattern: '[0-9]*', // pattern треба да оди тука
                        }}
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
