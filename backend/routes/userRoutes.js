import express from 'express';
import User from '../models/User.js'; // The .js extension is required here!

const router = express.Router();

// 1. GET ALL USERS
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// 2. ADD A NEW USER
router.post('/', async (req, res) => {
  try {
    const { name, email, role, mobile, status } = req.body;
    console.log("Receiving data:", req.body); // ADD THIS LINE

    const newUser = new User({ name, email, role, mobile, status });
    const savedUser = await newUser.save();
    
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("DATABASE ERROR:", error.message); // ADD THIS LINE
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

export default router;