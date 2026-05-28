import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, default: 'Accountant' },
  mobile: { type: String, required: true },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);