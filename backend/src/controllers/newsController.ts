import { Request, Response } from 'express';
import News from '../models/News';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

// Get all news articles with optional filters
export const getAllNews = asyncHandler(async (req: Request, res: Response) => {
  const { status, category } = req.query;
  const query: any = {};
  
  if (status) query.status = status;
  if (category) query.category = category;
  
  const news = await News.find(query).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: 'News retrieved successfully',
    data: news
  });
});

// Get a single news article by ID
export const getNewsById = asyncHandler(async (req: Request, res: Response) => {
  const news = await News.findById(req.params.id);
  if (!news) {
    throw new ApiError(404, 'News article not found');
  }
  
  res.status(200).json({
    success: true,
    message: 'News article retrieved successfully',
    data: news
  });
});

// Create a new news article
export const createNews = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, summary, image, author, category, status } = req.body;
  
  if (!title || !content || !summary) {
    throw new ApiError(400, 'Title, content and summary are required');
  }
  
  const news = await News.create({
    title,
    content,
    summary,
    image,
    author,
    category,
    status: status || 'draft',
    date: new Date().toISOString()
  });
  
  res.status(201).json({
    success: true,
    message: 'News article created successfully',
    data: news
  });
});

// Update a news article
export const updateNews = asyncHandler(async (req: Request, res: Response) => {
  const news = await News.findById(req.params.id);
  if (!news) {
    throw new ApiError(404, 'News article not found');
  }
  
  const updatedNews = await News.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    message: 'News article updated successfully',
    data: updatedNews
  });
});

// Delete a news article
export const deleteNews = asyncHandler(async (req: Request, res: Response) => {
  const news = await News.findById(req.params.id);
  if (!news) {
    throw new ApiError(404, 'News article not found');
  }
  
  await news.deleteOne();
  
  res.status(200).json({
    success: true,
    message: 'News article deleted successfully'
  });
});

export const getNews = async (req: Request, res: Response) => {
  try {
    const { status, category } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;

    const news = await News.find(query).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, 'News retrieved successfully', news));
  } catch (error) {
    throw new ApiError(500, 'Error retrieving news');
  }
}; 