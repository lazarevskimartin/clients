import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error('MONGO_URI not set');

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(mongoose => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

const clientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
});

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'GET') {
        const clients = await Client.find();
        return res.status(200).json(clients);
    }
    if (req.method === 'POST') {
        const { fullName, address, phone } = req.body;
        const client = new Client({ fullName, address, phone });
        await client.save();
        return res.status(201).json(client);
    }
    if (req.method === 'DELETE') {
        const { id } = req.query;
        await Client.findByIdAndDelete(id);
        return res.status(204).end();
    }
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
