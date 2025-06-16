import React, { useState } from 'react';
import { register } from '../utils/authApi';
import { TextField, Button } from '@mui/material';
import './Login.css';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePassword = (password: string) => {
        // At least 8 chars, one uppercase, one lowercase, one number, one special char
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.');
            return;
        }
        setLoading(true);
        try {
            await register(email, password);
            setSuccess('Registration successful! You can now log in.');
            setEmail('');
            setPassword('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
                <h2 style={{ marginBottom: 16, fontWeight: 600, fontSize: '1.5rem' }}>Регистрација</h2>
                {error && <div style={{ color: '#d32f2f', marginBottom: 16 }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: 16 }}>{success}</div>}
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
                    {loading ? 'Регистрирам...' : 'Регистрирај се'}
                </Button>
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <span>Имаш корисничка сметка? </span>
                  <a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('show-login')); }} style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}>Најава</a>
                </div>
            </form>
        </div>
    );
};

export default Register;
