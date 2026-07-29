import { Router } from 'express';
import { chat, history, clearChatHistory } from '../controllers/chat.controller.js';

const router = Router();

router.post('/', chat);
router.get('/history', history);
router.delete('/history', clearChatHistory);

export default router;
