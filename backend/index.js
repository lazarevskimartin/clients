import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Delivery from './models/Delivery.js';
import Client from './models/Client.js';
import Street from './models/Street.js';
import streetsRouter from './routes/streets.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Protect all client routes with authMiddleware
app.get('/api/clients', authMiddleware, async (req, res) => {
    const clients = await Client.find();
    res.json(clients);
});

app.post('/api/clients', authMiddleware, async (req, res) => {
    const { fullName, address, phone, note } = req.body;
    const client = new Client({ fullName, address, phone, note });
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

// Update status + note
app.patch('/api/clients/:id/status', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status, note } = req.body;
    if (!['delivered', 'undelivered', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const update = { status };
    if (typeof note !== 'undefined') {
        update.note = note;
    }
    const client = await Client.findByIdAndUpdate(id, update, { new: true });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
});

// Update all client fields (edit client) - PATCH or PUT
app.patch('/api/clients/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { fullName, address, phone, note } = req.body;
    if (!fullName || !address || !phone) {
        return res.status(400).json({ error: 'Сите полиња се задолжителни.' });
    }
    const update = { fullName, address, phone };
    if (typeof note !== 'undefined') update.note = note;
    const client = await Client.findByIdAndUpdate(
        id,
        update,
        { new: true }
    );
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
});

app.put('/api/clients/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { fullName, address, phone, note } = req.body;
    if (!fullName || !address || !phone) {
        return res.status(400).json({ error: 'Сите полиња се задолжителни.' });
    }
    const update = { fullName, address, phone };
    if (typeof note !== 'undefined') update.note = note;
    const client = await Client.findByIdAndUpdate(
        id,
        update,
        { new: true, overwrite: true }
    );
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
        // Ако има role во body и е валиден, користи го, инаку default
        let role = req.body.role;
        if (!['admin', 'operator', 'courier'].includes(role)) {
            role = 'courier';
        }
        const user = new User({ email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', role: user.role });
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
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
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

// Delivery records CRUD (protected)
app.get('/api/deliveries', authMiddleware, async (req, res) => {
    const deliveries = await Delivery.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(deliveries);
});

app.post('/api/deliveries', authMiddleware, async (req, res) => {
    const { date, delivered } = req.body;
    if (!date || delivered == null) return res.status(400).json({ error: 'Date and delivered required' });
    const delivery = new Delivery({ user: req.user.userId, date, delivered });
    await delivery.save();
    res.status(201).json(delivery);
});

app.put('/api/deliveries/:id', authMiddleware, async (req, res) => {
    const { date, delivered } = req.body;
    const { id } = req.params;
    const delivery = await Delivery.findOneAndUpdate(
        { _id: id, user: req.user.userId },
        { date, delivered },
        { new: true }
    );
    if (!delivery) return res.status(404).json({ error: 'Not found' });
    res.json(delivery);
});

app.delete('/api/deliveries/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const delivery = await Delivery.findOneAndDelete({ _id: id, user: req.user.userId });
    if (!delivery) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
});

app.use('/api/streets', authMiddleware, streetsRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
