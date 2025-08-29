import { Router } from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { createOrder, myOrders, vendorOrders, updateOrderStatus } from '../controllers/orderController.js';


const router = Router();


// Customer actions
router.post('/', protect, authorize('customer', 'admin'), createOrder);
router.get('/me', protect, authorize('customer', 'admin'), myOrders);


// Vendor actions
router.get('/vendor/me', protect, authorize('vendor', 'admin'), vendorOrders);
router.patch('/:id/status', protect, authorize('vendor', 'admin'), updateOrderStatus);


export default router;