import mongoose from 'mongoose';
import { config } from '../config';
import News from '../models/News';

const createTestNews = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Create test news articles
    const testArticles = [
      {
        title: 'Welcome to Root Coder Foundation',
        content: 'We are excited to announce the launch of Root Coder Foundation, dedicated to empowering young minds through technology education.',
        summary: 'Root Coder Foundation launches with a mission to provide tech education.',
        image: 'https://example.com/welcome.jpg',
        author: 'Admin',
        category: 'news',
        status: 'published',
        date: new Date(),
      },
      {
        title: 'New Coding Workshop Series',
        content: 'Join us for our upcoming series of coding workshops designed for beginners. Learn the basics of programming in a friendly environment.',
        summary: 'Free coding workshops for beginners starting next month.',
        image: 'https://example.com/workshop.jpg',
        author: 'Admin',
        category: 'update',
        status: 'published',
        date: new Date(),
      },
      {
        title: 'Student Success Story',
        content: 'Meet Sarah, one of our students who successfully completed our program and landed her first tech job.',
        summary: 'Inspiring story of a student\'s journey into tech.',
        image: 'https://example.com/success.jpg',
        author: 'Admin',
        category: 'story',
        status: 'published',
        date: new Date(),
      }
    ];

    // Insert the test articles
    await News.insertMany(testArticles);
    console.log('Test news articles created successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the script
createTestNews(); 