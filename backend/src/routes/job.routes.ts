import { Router } from 'express';
import { createJob, getJobs, getJobById, generateDescription } from '../controllers/job.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// PUBLIC routes (no auth needed)
router.get('/all', getJobs);         // All jobs for public careers page
router.get('/:id', getJobById);      // Job details for public apply page

// PROTECTED routes (auth required)
router.use(authenticate);

router.post('/generate-description', generateDescription);
router.post('/', createJob);
router.get('/', getJobs);

export default router;
