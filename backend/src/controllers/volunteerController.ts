import { Request, Response } from 'express';
import Volunteer, { IVolunteer } from '../models/Volunteer';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

// Get all volunteers
export const getAllVolunteers = asyncHandler(async (req: Request, res: Response) => {
  const volunteers = await Volunteer.find().sort({ createdAt: -1 });
  res.status(200).json(volunteers);
});

// Get single volunteer by ID
export const getVolunteerById = asyncHandler(async (req: Request, res: Response) => {
  const volunteer = await Volunteer.findById(req.params.id);
  
  if (!volunteer) {
    throw new ApiError(404, 'Volunteer not found');
  }
  
  res.status(200).json(volunteer);
});

// Create new volunteer
export const createVolunteer = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, skills, availability } = req.body;

  // Check if volunteer with email already exists
  const existingVolunteer = await Volunteer.findOne({ email });
  if (existingVolunteer) {
    throw new ApiError(400, 'Volunteer with this email already exists');
  }

  const volunteer = await Volunteer.create({
    name,
    email,
    phone,
    skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
    availability,
    status: 'active',
    joinedDate: new Date(),
    totalHours: 0,
  });

  res.status(201).json(volunteer);
});

// Update volunteer
export const updateVolunteer = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, skills, availability, status } = req.body;
  
  const volunteer = await Volunteer.findById(req.params.id);
  
  if (!volunteer) {
    throw new ApiError(404, 'Volunteer not found');
  }

  // If email is being updated, check if new email already exists
  if (email && email !== volunteer.email) {
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      throw new ApiError(400, 'Volunteer with this email already exists');
    }
  }

  // Update only provided fields
  if (name) volunteer.name = name;
  if (email) volunteer.email = email;
  if (phone) volunteer.phone = phone;
  if (skills) {
    volunteer.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
  }
  if (availability) volunteer.availability = availability;
  if (status) volunteer.status = status;

  await volunteer.save();
  
  res.status(200).json(volunteer);
});

// Delete volunteer
export const deleteVolunteer = asyncHandler(async (req: Request, res: Response) => {
  const volunteer = await Volunteer.findById(req.params.id);
  
  if (!volunteer) {
    throw new ApiError(404, 'Volunteer not found');
  }

  await volunteer.deleteOne();
  
  res.status(200).json({
    success: true,
    message: 'Volunteer deleted successfully',
  });
});

// Update volunteer hours
export const updateVolunteerHours = asyncHandler(async (req: Request, res: Response) => {
  const { hours } = req.body;
  
  if (typeof hours !== 'number' || hours < 0) {
    throw new ApiError(400, 'Invalid hours value');
  }

  const volunteer = await Volunteer.findById(req.params.id);
  
  if (!volunteer) {
    throw new ApiError(404, 'Volunteer not found');
  }

  volunteer.totalHours = hours;
  await volunteer.save();
  
  res.status(200).json(volunteer);
}); 