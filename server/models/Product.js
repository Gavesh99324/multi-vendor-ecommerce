import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
name: { type: String, required: true },
description: String,
price: { type: Number, required: true, min: 0 },
stock: { type: Number, required: true, min: 0 },
images: [String],
category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
ratingAvg: { type: Number, default: 0 },
ratingCount: { type: Number, default: 0 },
isActive: { type: Boolean, default: true }
}, { timestamps: true });


export default mongoose.model('Product', productSchema);