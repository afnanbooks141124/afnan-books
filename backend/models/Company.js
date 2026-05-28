import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  gstin: { type: String, required: true, unique: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  state: { type: String, required: true },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Company', companySchema);