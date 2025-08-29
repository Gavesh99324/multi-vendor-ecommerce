import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { charge } from '../services/paymentService.js';
import { sendEmail } from '../services/emailService.js';
import { requireFields } from '../utils/validators.js';


export const createOrder = asyncHandler(async (req, res) => {
requireFields(['items', 'shippingAddress'], req.body);
const items = req.body.items; // [{ product, quantity }]
if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });


// Load products & group by vendor (simple: one vendor per order request here)
const products = await Product.find({ _id: { $in: items.map(i => i.product) }, isActive: true }).populate('vendor');
if (products.length !== items.length) return res.status(400).json({ message: 'Some items invalid' });


const vendorId = products[0].vendor._id.toString();
if (products.some(p => p.vendor._id.toString() !== vendorId)) {
return res.status(400).json({ message: 'Items must be from same vendor per order request' });
}

// Compute totals & check stock
let subtotal = 0;
for (const p of products) {
const qty = items.find(i => i.product === p._id.toString()).quantity;
if (p.stock < qty) return res.status(400).json({ message: `Insufficient stock: ${p.name}` });
subtotal += p.price * qty;
}
const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10%
const shipping = subtotal > 10000 ? 0 : 500; // example rule
const total = subtotal + tax + shipping;


// Payment (stub)
const payment = await charge({ amount: total, currency: 'LKR', source: 'tok_visa', metadata: { customer: req.user.id } });


// Persist order & decrement stock
const order = await Order.create({
customer: req.user.id,
vendor: vendorId,
items: products.map(p => ({ product: p._id, name: p.name, price: p.price, quantity: items.find(i => i.product === p._id.toString()).quantity })),
subtotal, tax, shipping, total,
status: 'paid',
payment: { provider: 'stripe', reference: payment.id, paidAt: new Date() },
shippingAddress: req.body.shippingAddress
});


for (const p of products) {
const qty = items.find(i => i.product === p._id.toString()).quantity;
p.stock -= qty; await p.save();
}


await sendEmail({ to: 'customer@example.com', subject: 'Order Confirmation', html: `<p>Order ${order._id} confirmed</p>` });


res.status(201).json(order);
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user.id }).sort('-createdAt');
  res.json(orders);
  });
  
  
  export const vendorOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ vendor: req.user.id }).sort('-createdAt');
  res.json(orders);
  });
  
  
  export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, vendor: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  const allowed = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
  order.status = req.body.status; await order.save();
  res.json(order);
  });