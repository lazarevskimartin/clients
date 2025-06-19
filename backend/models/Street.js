import mongoose from 'mongoose';

const StreetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    googleMapsName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    order: {
        type: Number,
        default: 0,
    },
});

const Street = mongoose.model('Street', StreetSchema);
export default Street;
