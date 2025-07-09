import { Router } from 'express';
import { userRoutes } from '@routes/userRoutes';
import { authRoutes } from '@routes/authRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;