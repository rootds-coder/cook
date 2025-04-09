import express from 'express';
import {
  getAllVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  updateVolunteerHours,
} from '../controllers/volunteerController';
import { verifyJWT } from '../middleware/auth';
import { validateResource } from '../middleware/validateResource';
import { createVolunteerSchema, updateVolunteerSchema, updateVolunteerHoursSchema } from '../schemas/volunteerSchema';

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Get all volunteers and create new volunteer
router
  .route('/')
  .get(getAllVolunteers)
  .post(validateResource(createVolunteerSchema), createVolunteer);

// Get, update and delete volunteer by ID
router
  .route('/:id')
  .get(getVolunteerById)
  .put(validateResource(updateVolunteerSchema), updateVolunteer)
  .delete(deleteVolunteer);

// Update volunteer hours
router.patch(
  '/:id/hours',
  validateResource(updateVolunteerHoursSchema),
  updateVolunteerHours
);

export default router; 