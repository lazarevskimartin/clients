import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // ISO date string
  delivered: { type: Number, required: true },
}, { timestamps: true });

const Delivery = mongoose.model('Delivery', DeliverySchema);
export default Delivery;
