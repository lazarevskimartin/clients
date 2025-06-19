import express from 'express';
import Street from '../models/Street.js';
const router = express.Router();

// Get all streets
router.get('/', async (req, res) => {
    try {
        const streets = await Street.find().sort({ order: 1, createdAt: 1 });
        res.json(streets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new street
router.post('/', async (req, res) => {
    const { name, googleMapsName } = req.body;
    if (!name || !googleMapsName) {
        return res.status(400).json({ message: 'Name and Google Maps name are required.' });
    }
    try {
        const street = new Street({ name, googleMapsName });
        await street.save();
        res.status(201).json(street);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update order of streets
router.patch('/order', async (req, res) => {
    const { order } = req.body; // [{_id, order}, ...]
    if (!Array.isArray(order)) return res.status(400).json({ message: 'Order array required' });
    try {
        for (const item of order) {
            await Street.findByIdAndUpdate(item._id, { order: item.order });
        }
        res.json({ message: 'Order updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a street
router.delete('/:id', async (req, res) => {
    try {
        await Street.findByIdAndDelete(req.params.id);
        res.json({ message: 'Street deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
