import asyncHandler from 'express-async-handler';
});


export const getProduct = asyncHandler(async (req, res) => {
const product = await Product.findById(req.params.id).populate('category', 'name').populate('vendor', 'name vendor.shopName');
if (!product) return res.status(404).json({ message: 'Product not found' });
res.json(product);
});


export const createProduct = asyncHandler(async (req, res) => {
requireFields(['name', 'price', 'stock', 'category'], req.body);
const category = await Category.findById(req.body.category);
if (!category) return res.status(400).json({ message: 'Invalid category' });


const product = await Product.create({
name: req.body.name,
description: req.body.description,
price: req.body.price,
stock: req.body.stock,
images: req.body.images || [],
category: category._id,
vendor: req.user.id
});
res.status(201).json(product);
});


export const updateProduct = asyncHandler(async (req, res) => {
const product = await Product.findOne({ _id: req.params.id, vendor: req.user.id });
if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
const updatable = ['name', 'description', 'price', 'stock', 'images', 'category', 'isActive'];
updatable.forEach((k) => { if (req.body[k] !== undefined) product[k] = req.body[k]; });
await product.save();
res.json(product);
});


export const deleteProduct = asyncHandler(async (req, res) => {
const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
res.json({ message: 'Product deleted' });
});


export const addReview = asyncHandler(async (req, res) => {
requireFields(['rating'], req.body);
const { rating, comment } = req.body;
const productId = req.params.id;


const review = await Review.create({ product: productId, user: req.user.id, rating, comment });
await recalcProductRating(review.product);
res.status(201).json(review);
});


export const listReviews = asyncHandler(async (req, res) => {
const reviews = await Review.find({ product: req.params.id }).populate('user', 'name');
res.json(reviews);
});