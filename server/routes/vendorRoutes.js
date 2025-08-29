import { Router } from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { vendorStats } from '../controllers/vendorController.js';


const router = Router();
router.get('/stats', protect, authorize('vendor', 'admin'), vendorStats);
export default router;