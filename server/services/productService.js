import Product from '../models/Product.js';


export const recalcProductRating = async (productId, session) => {
// Lazy aggregate to compute ratingAvg & ratingCount when needed
const [stats] = await Product.aggregate([
{ $match: { _id: productId } },
{
$lookup: {
from: 'reviews',
localField: '_id',
foreignField: 'product',
as: 'reviews'
}
},
{ $project: { ratingAvg: { $avg: '$reviews.rating' }, ratingCount: { $size: '$reviews' } } }
]).session(session || null);


const ratingAvg = Number(stats?.ratingAvg || 0).toFixed(2);
const ratingCount = Number(stats?.ratingCount || 0);
await Product.findByIdAndUpdate(productId, { ratingAvg, ratingCount }, { session });
};