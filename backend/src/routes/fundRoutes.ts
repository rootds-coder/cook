import { Router } from 'express';
import * as fundController from '../controllers/fundController';
import { protect } from '../middleware/auth';
// import { validateResource } from '../middleware/validateResource'; // Comment out for now
import { createFundSchema, updateFundSchema } from '../schemas/fundSchema';

const router = Router();

// router.post('/', protect, validateResource(createFundSchema), fundController.createFund); // Comment out validation
router.post('/', protect, fundController.createFund); // Use without validation for now
// ... other routes using validateResource - comment out validation

export default router;