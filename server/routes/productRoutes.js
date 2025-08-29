import { Router } from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview, listReviews } from '../controllers/productController.js';


const router = Router();


router.get('/', listProducts);
router.get('/:id', getProduct);


// Vendor-only product management
router.post('/', protect, authorize('vendor', 'admin'), createProduct);
router.patch('/:id', protect, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);


// Reviews (customers)
router.get('/:id/reviews', listReviews);
router.post('/:id/reviews', protect, authorize('customer', 'admin'), addReview);


export default router;