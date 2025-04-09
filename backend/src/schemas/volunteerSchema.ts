import { z } from 'zod';

const volunteerCore = {
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+?[\d\s-()]{10,}$/, 'Invalid phone number format'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  availability: z.array(z.string()).min(1, 'At least one availability slot is required'),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
};

export const createVolunteerSchema = z.object({
  body: z.object({
    ...volunteerCore,
  }),
});

export const updateVolunteerSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    ...volunteerCore,
  }).partial(),
});

export const updateVolunteerHoursSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    hours: z.number().min(0, 'Hours cannot be negative'),
  }),
}); 