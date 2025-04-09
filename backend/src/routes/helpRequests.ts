import express from 'express';
import {
  createHelpRequest,
  getHelpRequests,
  getAllHelpRequests,
  updateHelpRequestStatus,
  deleteHelpRequest
} from '../controllers/helpRequestController';

const router = express.Router();

// Public routes
router.post('/', createHelpRequest);
router.get('/', getHelpRequests);

// Admin routes
router.get('/all', getAllHelpRequests);
router.patch('/:id/status', updateHelpRequestStatus);
router.delete('/:id', deleteHelpRequest);

export default router;
