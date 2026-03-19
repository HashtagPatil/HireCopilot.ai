import { Router } from 'express';
import { createJob, getJobs, getJobById, generateDescription } from '../controllers/job.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/generate-description', generateDescription);
router.post('/', createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);

export default router;
