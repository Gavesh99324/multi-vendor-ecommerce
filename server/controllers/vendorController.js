import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Order from '../models/Order.js';


export const vendorStats = asyncHandler(async (req, res) => {
const [productCount, orderCount, revenue] = await Promise.all([
Product.countDocuments({ vendor: req.user.id }),
Order.countDocuments({ vendor: req.user.id }),
Order.aggregate([
{ $match: { vendor: req.user._id || req.user.id, status: { $in: ['paid', 'shipped', 'delivered'] } } },
{ $group: { _id: null, total: { $sum: '$total' } } }
])
]);
res.json({ productCount, orderCount, revenue: revenue[0]?.total || 0 });
});