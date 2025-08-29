import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Category from '../models/Category.js';


export const listUsers = asyncHandler(async (req, res) => {
const users = await User.find().select('-password');
res.json(users);
});


export const toggleVendorVerification = asyncHandler(async (req, res) => {
const user = await User.findById(req.params.id);
if (!user || user.role !== 'vendor') return res.status(404).json({ message: 'Vendor not found' });
user.vendor = user.vendor || {};
user.vendor.verified = !user.vendor.verified;
await user.save();
res.json({ id: user._id, verified: user.vendor.verified });
});


export const createCategory = asyncHandler(async (req, res) => {
const cat = await Category.create({ name: req.body.name, description: req.body.description });
res.status(201).json(cat);
});


export const listCategories = asyncHandler(async (req, res) => {
const cats = await Category.find({ isActive: true });
res.json(cats);
});


export const deactivateCategory = asyncHandler(async (req, res) => {
const cat = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
if (!cat) return res.status(404).json({ message: 'Category not found' });
res.json(cat);
});