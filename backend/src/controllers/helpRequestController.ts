import { Request, Response } from 'express';
import HelpRequest from '../models/HelpRequest';

export const createHelpRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, email, name } = req.body;

    const helpRequest = new HelpRequest({
      title,
      description,
      email,
      name,
      status: 'pending'
    });

    await helpRequest.save();
    res.status(201).json(helpRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating help request', error });
  }
};

export const getHelpRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.query;
    
    const query = email ? { email } : {};
    const requests = await HelpRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching help requests', error });
  }
};

export const getAllHelpRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const helpRequests = await HelpRequest.find().sort({ createdAt: -1 });
    res.status(200).json(helpRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching help requests', error });
  }
};

export const updateHelpRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Calculate deletion date if status is resolved
    const update: any = { status };
    if (status === 'resolved') {
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      update.deletionDate = new Date(Date.now() + oneWeek);
    } else {
      // If status is changed back to pending/inProgress, remove deletion date
      update.$unset = { deletionDate: 1 };
    }

    const helpRequest = await HelpRequest.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );

    if (!helpRequest) {
      res.status(404).json({ message: 'Help request not found' });
      return;
    }

    res.status(200).json(helpRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating help request status', error });
  }
};

export const deleteHelpRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const helpRequest = await HelpRequest.findByIdAndDelete(id);
    
    if (!helpRequest) {
      res.status(404).json({ message: 'Help request not found' });
      return;
    }

    res.status(200).json({ message: 'Help request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting help request', error });
  }
};
