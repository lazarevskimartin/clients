import React, { useState } from 'react';
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
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Најава</h2>
                <input
                    type="text"
                    placeholder="Корисничко име"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Лозинка"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                {error && <div className="login-error">{error}</div>}
                <button type="submit">Најава</button>
            </form>
        </div>
    );
};

export default Login;
