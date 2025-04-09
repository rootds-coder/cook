import axios, { AxiosError } from 'axios';
import { API_URL } from '../config';

const getAuthToken = () => localStorage.getItem('token');

const getHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new ApiError('No authentication token found', 401);
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

interface MongoDBResponse {
  _id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  date: string;
  status: 'draft' | 'published';
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface NewsArticle {
  _id: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  author: string;
  category: 'news' | 'story' | 'update';
  status: 'draft' | 'published';
  date: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error('API Error:', {
      status: axiosError.response?.status,
      message: axiosError.response?.data?.message,
      code: axiosError.code,
      headers: axiosError.response?.headers
    });
    throw new ApiError(
      axiosError.response?.data?.message || 'An error occurred',
      axiosError.response?.status,
      axiosError.code
    );
  }
  console.error('Unknown Error:', error);
  throw error;
};

const mapArticleResponse = (data: MongoDBResponse): NewsArticle => {
  console.log('Mapping article response:', data); // Debug log
  if (!data._id) {
    console.error('Article missing _id:', data);
    throw new Error('Article missing _id');
  }
  
  const mappedArticle: NewsArticle = {
    _id: data._id,
    title: data.title,
    content: data.content,
    summary: data.summary,
    image: data.image,
    author: data.author || '',
    category: data.category as 'news' | 'story' | 'update',
    status: data.status,
    date: data.date,
    publishedAt: data.publishedAt,
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || '',
  };
  
  console.log('Mapped article:', mappedArticle); // Debug log
  return mappedArticle;
};

export interface News {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  category: 'news' | 'story' | 'update';
  status: 'draft' | 'published';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

class NewsService {
  async getAllNews(status?: string) {
    try {
      const url = status ? `${API_URL}/news?status=${status}` : `${API_URL}/news`;
      const response = await axios.get(url);
      return {
        success: true,
        data: Array.isArray(response.data.data) ? response.data.data : []
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      return {
        success: false,
        data: []
      };
    }
  }

  async getNewsById(id: string) {
    try {
      const response = await axios.get(`${API_URL}/news/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching news by id:', error);
      return {
        success: false,
        data: null
      };
    }
  }

  async createNews(newsData: Partial<NewsArticle>) {
    try {
      const response = await axios.post(`${API_URL}/news`, newsData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error creating news:', error);
      return {
        success: false,
        data: null
      };
    }
  }

  async updateNews(id: string, newsData: Partial<NewsArticle>) {
    try {
      const response = await axios.put(`${API_URL}/news/${id}`, newsData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error updating news:', error);
      return {
        success: false,
        data: null
      };
    }
  }

  async deleteNews(id: string) {
    try {
      const response = await axios.delete(`${API_URL}/news/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error deleting news:', error);
      return {
        success: false,
        data: null
      };
    }
  }

  async getPublishedNews() {
    return this.getAllNews('published');
  }
}

export default new NewsService(); 