import express from 'express';
import {
  getAllFunds,
  getFundById,
  createFund,
  updateFund,
  deleteFund,
} from '../controllers/fundController';
import { verifyJWT } from '../middleware/auth';
import { validateResource } from '../middleware/validateResource';
import { createFundSchema, updateFundSchema } from '../schemas/fundSchema';

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Get all funds and create new fund
router
  .route('/')
  .get(getAllFunds)
  .post(validateResource(createFundSchema), createFund);

// Get, update and delete fund by ID
router
  .route('/:id')
  .get(getFundById)
  .put(validateResource(updateFundSchema), updateFund)
  .delete(deleteFund);

export default router; 