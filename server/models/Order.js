import mongoose from 'mongoose';


const orderItemSchema = new mongoose.Schema({
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
name: String,
price: Number,
quantity: { type: Number, min: 1, required: true }
}, { _id: false });


const orderSchema = new mongoose.Schema({
customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
items: [orderItemSchema],
subtotal: { type: Number, required: true },
tax: { type: Number, default: 0 },
shipping: { type: Number, default: 0 },
total: { type: Number, required: true },
status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
payment: {
provider: { type: String, default: 'stripe' },
reference: String,
paidAt: Date
},
shippingAddress: {
line1: String,
line2: String,
city: String,
state: String,
postalCode: String,
country: String
}
}, { timestamps: true });


export default mongoose.model('Order', orderSchema);