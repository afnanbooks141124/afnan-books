import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// 1. GLOBAL CORS UNLOCKER
app.use(cors({ origin: '*' }));
app.use(express.json());

// 2. MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// 3. DATABASE SCHEMAS
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "User" }
});
const User = mongoose.model('User', userSchema);

const companySchema = new mongoose.Schema({
  name: String, contact: String, email: String
});
const Company = mongoose.model('Company', companySchema);

// 4. SMART SETUP: Master Admin Account
const setupAdmin = async () => {
  const adminExists = await User.findOne({ email: "admin@company.com" });
  if (!adminExists) {
    await User.create({
      email: "admin@company.com",
      password: "afnan123",
      name: "Afrid R Goundi",
      role: "Accounts Manager"
    });
    console.log("👑 Master Admin account automatically provisioned.");
  }
};
setupAdmin();

// 5. SECURE API ROUTES

// --- HEALTH CHECK ROUTE (NEW) ---
app.get('/', (req, res) => {
  res.send("AFNAN BOOKS API IS LIVE AND UPDATED!");
});

// --- AUTH ROUTE ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 
    
    if (!user) return res.status(401).json({ error: "Invalid email address." });
    
    if (password === user.password) { 
      res.json({ message: "Login successful", user: { name: user.name, role: user.role } });
    } else {
      res.status(401).json({ error: "Invalid password." });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error during login." });
  }
});

// --- DATA ROUTES ---
app.get('/api/companies', async (req, res) => {
  try { const companies = await Company.find(); res.json(companies); } 
  catch (error) { res.status(500).json({ error: "Failed to fetch companies" }); }
});

// 6. SERVER INIT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running beautifully on port ${PORT}`);
});