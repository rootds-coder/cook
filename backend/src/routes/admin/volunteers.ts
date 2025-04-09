import express from 'express';
import { authenticateAdmin } from '../../middleware/auth';
import Volunteer from '../../models/Volunteer';

const router = express.Router();

// Get all volunteers
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteers' });
  }
});

// Add new volunteer
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, phone, skills, availability, status } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    const newVolunteer = new Volunteer({
      name,
      email,
      phone,
      skills: Array.isArray(skills) ? skills : [],
      availability,
      status,
      joinedDate: new Date()
    });

    const savedVolunteer = await newVolunteer.save();
    res.status(201).json(savedVolunteer);
  } catch (error) {
    res.status(500).json({ message: 'Error adding volunteer' });
  }
});

// Update volunteer
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, phone, skills, availability, status } = req.body;
    
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        skills: Array.isArray(skills) ? skills : [],
        availability,
        status
      },
      { new: true }
    );

    if (!updatedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json(updatedVolunteer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating volunteer' });
  }
});

// Delete volunteer
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.params.id);
    
    if (!deletedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting volunteer' });
  }
});

export default router; 