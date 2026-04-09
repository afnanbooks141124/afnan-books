import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Initialize app & environment variables
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- DATABASE SCHEMA & MODEL ---
// This tells MongoDB exactly what data a "Company" should have
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  tradeName: { type: String, default: "-" },
  gstin: { type: String, required: true },
  pan: { type: String, default: "-" },
  client: { type: String, default: "Assign Client" },
  mobile: { type: String, default: "-" }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

// --- API ROUTES ---

// Add this simple route to stop the 404 errors!
app.get('/', (req, res) => {
  res.send('Afnan Books Backend API is running perfectly!');
});

// 1. GET: Fetch all companies from the database
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.find(); // Fetches everything from MongoDB
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. POST: Add a brand new company to the database
app.post('/api/companies', async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save(); // Saves to MongoDB
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(400).json({ message: "Failed to create company", error });
  }
});
// ... existing POST route above this line ...

// 3. PUT: Update an existing company
app.put('/api/companies/:id', async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // returns the updated document
    );
    res.json(updatedCompany);
  } catch (error) {
    res.status(400).json({ message: "Failed to update company", error });
  }
});

// 4. DELETE: Remove a company
app.delete('/api/companies/:id', async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company successfully deleted" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete company", error });
  }
});

// ==========================================
// --- USER SCHEMA & MODEL ---
// ==========================================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: "Primary User" },
  mobile: { type: String, required: true },
  status: { type: String, default: "Active" }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// --- USER API ROUTES ---

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new user
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: "Failed to create user", error });
  }
});

// PUT (Update) a user
app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Failed to update user", error });
  }
});

// DELETE a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User successfully deleted" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete user", error });
  }
});

// --- DASHBOARD STATS ROUTE ---
app.get('/api/stats', async (req, res) => {
  try {
    const companiesCount = await Company.countDocuments();
    const usersCount = await User.countDocuments();
    res.json({ companies: companiesCount, users: usersCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running beautifully on http://localhost:${PORT}`);
});