import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const clientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ['delivered', 'undelivered', 'pending'], default: 'pending' }
});

const Client = mongoose.model('Client', clientSchema);

// Protect all client routes with authMiddleware
app.get('/api/clients', authMiddleware, async (req, res) => {
    const clients = await Client.find();
    res.json(clients);
});

app.post('/api/clients', authMiddleware, async (req, res) => {
    const { fullName, address, phone } = req.body;
    const client = new Client({ fullName, address, phone });
    await client.save();
    res.status(201).json(client);
});

app.delete('/api/clients/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
    res.status(204).end();
});

app.get('/api/clients/status/:status', authMiddleware, async (req, res) => {
    const { status } = req.params;
    if (!['delivered', 'undelivered', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const clients = await Client.find({ status });
    res.json(clients);
});

app.patch('/api/clients/:id/status', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['delivered', 'undelivered', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const client = await Client.findByIdAndUpdate(id, { status }, { new: true });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Auth middleware
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Example protected route
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Get user profile (protected)
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
