import React, { useState } from 'react';
import { addStreet } from '../utils/streetsApi';

interface AddStreetFormProps {
    token: string;
    onStreetAdded: () => void;
}

const AddStreetForm: React.FC<AddStreetFormProps> = ({ token, onStreetAdded }) => {
    const [name, setName] = useState('');
    const [googleMapsName, setGoogleMapsName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await addStreet(name, googleMapsName, token);
            setName('');
            setGoogleMapsName('');
            onStreetAdded();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Грешка при додавање улица');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
                type="text"
                placeholder="Име на улица"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ fontSize: 16, padding: 8 }}
            />
            <input
                type="text"
                placeholder="Име/линк за Google Maps"
                value={googleMapsName}
                onChange={e => setGoogleMapsName(e.target.value)}
                required
                style={{ fontSize: 16, padding: 8 }}
            />
            <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>
                {loading ? 'Се додава...' : 'Додај улица'}
            </button>
            {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
        </form>
    );
};

export default AddStreetForm;
