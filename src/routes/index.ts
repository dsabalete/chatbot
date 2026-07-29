import { Router } from 'express';
import { health, about, experience } from '../controllers/cv.controller.js';
import chatRoutes from './chat.routes.js';

const router = Router();

router.get('/health', health);
router.get('/about', about);
router.get('/experience', experience);
router.use('/api/chat', chatRoutes);

export default router;
