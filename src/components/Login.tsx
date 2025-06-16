import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import './Login.css';

interface LoginProps {
    onLogin: (username: string, password: string) => void;
    error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
                <h2 style={{ marginBottom: 16, fontWeight: 600, fontSize: '1.5rem' }}>Најава</h2>
                {error && <div style={{ color: '#d32f2f', marginBottom: 16 }}>{error}</div>}
                <TextField
                    label="Корисничко име"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
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
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Најави се
                </Button>
            </form>
        </div>
    );
};

export default Login;
