import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { requireFields } from '../utils/validators.js';


const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });


export const register = asyncHandler(async (req, res) => {
requireFields(['name', 'email', 'password'], req.body);
const exists = await User.findOne({ email: req.body.email.toLowerCase() });
if (exists) return res.status(409).json({ message: 'Email already in use' });


const user = await User.create({
name: req.body.name,
email: req.body.email.toLowerCase(),
password: req.body.password,
role: req.body.role && ['customer', 'vendor', 'admin'].includes(req.body.role) ? req.body.role : 'customer',
vendor: req.body.role === 'vendor' ? { shopName: req.body.shopName || 'My Shop' } : undefined
});


const token = signToken(user._id, user.role);
res.status(201).json({
user: { id: user._id, name: user.name, email: user.email, role: user.role },
token
});
});


export const login = asyncHandler(async (req, res) => {
requireFields(['email', 'password'], req.body);
const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const ok = await user.comparePassword(req.body.password);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
const token = signToken(user._id, user.role);
res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
});


export const me = asyncHandler(async (req, res) => {
const user = await User.findById(req.user.id);
res.json({ user });
});