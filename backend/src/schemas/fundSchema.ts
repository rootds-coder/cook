import { object, string, number, date } from 'zod';

export const createFundSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }).min(2, 'Name must be at least 2 characters'),
    
    description: string({
      required_error: 'Description is required',
    }).min(10, 'Description must be at least 10 characters'),
    
    targetAmount: number({
      required_error: 'Target amount is required',
    }).min(0, 'Target amount cannot be negative'),
    
    startDate: string({
      required_error: 'Start date is required',
    }).refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid start date format',
    }),
    
    endDate: string({
      required_error: 'End date is required',
    }).refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid end date format',
    }),
  }).refine((data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return endDate > startDate;
  }, {
    message: 'End date must be after start date',
    path: ['endDate'],
  }),
});

export const updateFundSchema = object({
  params: object({
    id: string({
      required_error: 'Fund ID is required',
    }),
  }),
  body: object({
    name: string().min(2, 'Name must be at least 2 characters').optional(),
    description: string().min(10, 'Description must be at least 10 characters').optional(),
    targetAmount: number().min(0, 'Target amount cannot be negative').optional(),
    startDate: string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid start date format',
      })
      .optional(),
    endDate: string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid end date format',
      })
      .optional(),
    status: string()
      .refine((status) => ['active', 'completed', 'pending'].includes(status), {
        message: 'Invalid status',
      })
      .optional(),
  }).refine((data) => {
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate > startDate;
    }
    return true;
  }, {
    message: 'End date must be after start date',
    path: ['endDate'],
  }),
}); 