import { Router } from 'express';
import { chatWithRecruiter } from '../controllers/chat.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.post('/', chatWithRecruiter);

export default router;
