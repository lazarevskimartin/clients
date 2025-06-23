import React, { useState, useEffect } from 'react';
import type { Client } from '../types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, InputAdornment } from '@mui/material';

interface ClientModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (client: Partial<Client>) => void;
    streetOptions: string[];
    initialData?: Partial<Client>;
    mode?: 'add' | 'edit';
}

const ClientModal: React.FC<ClientModalProps> = ({ open, onClose, onSubmit, streetOptions, initialData = {}, mode = 'add' }) => {
    const [fullName, setFullName] = useState(initialData.fullName || '');
    const [address, setAddress] = useState(initialData.address ? (initialData.address.split(' ').slice(0, -1).join(' ') || initialData.address) : '');
    const [streetNumber, setStreetNumber] = useState(initialData.address ? (initialData.address.split(' ').pop() || '') : '');
    const [phoneSuffix, setPhoneSuffix] = useState(initialData.phone ? initialData.phone.replace('+389', '') : '');
    const [note, setNote] = useState(initialData.note || '');

    // Only reset fields when opening the modal for a new client
    useEffect(() => {
        if (open) {
            setFullName(initialData.fullName || '');
            setAddress(initialData.address ? (initialData.address.split(' ').slice(0, -1).join(' ') || initialData.address) : '');
            setStreetNumber(initialData.address ? (initialData.address.split(' ').pop() || '') : '');
            setPhoneSuffix(initialData.phone ? initialData.phone.replace('+389', '') : '');
            setNote(initialData.note || '');
        }
        // eslint-disable-next-line
    }, [open]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setPhoneSuffix(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...initialData,
            fullName,
            address: address + (streetNumber ? ' ' + streetNumber : ''),
            phone: '+389' + phoneSuffix,
            note,
        });
    };

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{mode === 'edit' ? 'Измени клиент' : 'Додај клиент'}</DialogTitle>
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
                            maxLength: 8,
                            pattern: '[0-9]*',
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
                        {streetOptions.map(opt => (
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
                    <TextField
                        label="Белешка (опционално)"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        minRows={1}
                        maxRows={4}
                    />
                    <DialogActions>
                        <Button onClick={onClose} color="secondary">Откажи</Button>
                        <Button type="submit" variant="contained">{mode === 'edit' ? 'Зачувај' : 'Додај'}</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ClientModal;
