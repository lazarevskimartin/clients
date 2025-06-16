import React, { useState } from 'react';
import type { Client } from '../types';

const ADDRESS_OPTIONS = [
    'В. Манџуковски',
    'Анастас Митрев',
    'Петар Ацев',
    'Симеон Кавракиров',
    'К. Ј. Питу',
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
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullAddress = streetNumber ? `${address} ${streetNumber}` : address;
        onAdd({ fullName, address: fullAddress, phone });
        setFullName('');
        setAddress('');
        setStreetNumber('');
        setPhone('');
        onClose();
    };

    if (!open) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Додади нов клиент</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Име и презиме"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                    />
                    <select
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                    >
                        <option value="" disabled>Избери адреса</option>
                        {ADDRESS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Број на улица"
                        value={streetNumber}
                        onChange={e => setStreetNumber(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Број на телефон"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                    />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Откажи</button>
                        <button type="submit">Додади</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClientModal;
