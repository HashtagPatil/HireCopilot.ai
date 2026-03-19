import { Router } from 'express';
import { uploadResume, updateCandidateStatus, generateCandidateEmail } from '../controllers/candidate.controller';
import { authenticate } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.use(authenticate);

// Use multer locally to handle multipart
router.post('/upload', upload.single('resume'), uploadResume);
router.patch('/:id/status', updateCandidateStatus);
router.get('/:id/email', generateCandidateEmail);

export default router;
