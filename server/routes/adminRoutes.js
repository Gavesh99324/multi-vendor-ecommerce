import { Router } from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { listUsers, toggleVendorVerification, createCategory, listCategories, deactivateCategory } from '../controllers/adminController.js';


const router = Router();
router.use(protect, authorize('admin'));


router.get('/users', listUsers);
router.patch('/vendors/:id/verify', toggleVendorVerification);


router.post('/categories', createCategory);
router.get('/categories', listCategories);
router.patch('/categories/:id/deactivate', deactivateCategory);


export default router;