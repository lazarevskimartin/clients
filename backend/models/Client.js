import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['delivered', 'undelivered', 'pending'], default: 'pending' },
  undeliveredNote: { type: String }, // Опис за недоставена
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
export default Client;
