import mongoose from 'mongoose';
import Admin from '../models/Admin';
import { config } from '../config';
import bcrypt from 'bcryptjs';

async function updateAdminCredentials() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('dhruv', salt);

    // Find admin by username and update credentials
    const updatedAdmin = await Admin.findOneAndUpdate(
      {}, // This will update the first admin document
      {
        username: 'rootcoder',
        password: hashedPassword
      },
      { 
        new: true,
        upsert: true // Create if doesn't exist
      }
    );

    console.log('Admin credentials updated successfully');
    console.log('Username:', updatedAdmin.username);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating admin credentials:', error);
  }
}

// Run the update function
updateAdminCredentials();
