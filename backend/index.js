import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

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

app.get('/api/clients', async (req, res) => {
    const clients = await Client.find();
    res.json(clients);
});

app.post('/api/clients', async (req, res) => {
    const { fullName, address, phone } = req.body;
    const client = new Client({ fullName, address, phone });
    await client.save();
    res.status(201).json(client);
});

app.delete('/api/clients/:id', async (req, res) => {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
    res.status(204).end();
});

// Get clients by status
app.get('/api/clients/status/:status', async (req, res) => {
    const { status } = req.params;
    if (!['delivered', 'undelivered', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const clients = await Client.find({ status });
    res.json(clients);
});

// Update client status
app.patch('/api/clients/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['delivered', 'undelivered', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const client = await Client.findByIdAndUpdate(id, { status }, { new: true });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
