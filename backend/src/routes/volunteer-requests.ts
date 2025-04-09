import express from 'express';
import Message from '../models/Message';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      skills,
      availability,
      message,
      type,
      status
    } = req.body;

    // Create a new message with volunteer request details
    const volunteerRequest = new Message({
      name,
      email,
      phone,
      subject: 'Volunteer Application',
      message: `
Why I want to volunteer:
${message}

Skills: ${skills}
Availability: ${availability}
Phone: ${phone}
`,
      type: 'volunteer_request',
      status: 'unread',
      skills,
      availability
    });

    await volunteerRequest.save();
    
    res.status(201).json({ message: 'Volunteer request submitted successfully' });
  } catch (error) {
    console.error('Error submitting volunteer request:', error);
    res.status(500).json({ message: 'Failed to submit volunteer request' });
  }
});

export default router; 