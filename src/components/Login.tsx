import React, { useState } from 'react';
import { login } from '../utils/authApi';
import { TextField, Button } from '@mui/material';
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(email, password);
            localStorage.setItem('token', res.data.token);
            window.location.reload(); // or redirect to dashboard
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360, background: '#fff', padding: '2rem 1.5rem', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
                <h2 style={{ marginBottom: 16, fontWeight: 600, fontSize: '1.5rem', textAlign: 'center' }}>Најава</h2>
                {error && <div style={{ color: '#d32f2f', marginBottom: 16, textAlign: 'center' }}>{error}</div>}
                <TextField
                    label="Емаил адреса"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Лозинка"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                    {loading ? 'Се најавувам...' : 'Најави се'}
                </Button>
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <span>Немаш корисничка сметка? </span>
                    <a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('show-register')); }} style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}>Регистрирај се</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
