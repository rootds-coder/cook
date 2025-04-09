import axios from 'axios';
import { API_URL } from '../config';

export interface Fund {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  endDate: string;
}

export interface CreateFundDTO {
  name: string;
  description: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
}

export interface UpdateFundDTO extends Partial<CreateFundDTO> {
  status?: 'active' | 'completed' | 'pending';
}

class FundService {
  private handleApiError(error: any): never {
    console.error('API Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'An error occurred');
  }

  async getAll(): Promise<Fund[]> {
    try {
      console.log('Fetching all funds');
      const response = await axios.get(`${API_URL}/funds`);
      return response.data;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getById(id: string): Promise<Fund> {
    try {
      console.log(`Fetching fund with id: ${id}`);
      const response = await axios.get(`${API_URL}/funds/${id}`);
      return response.data;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async create(fund: CreateFundDTO): Promise<Fund> {
    try {
      console.log('Creating new fund:', fund);
      const response = await axios.post(`${API_URL}/funds`, fund);
      return response.data;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async update(id: string, fund: UpdateFundDTO): Promise<Fund> {
    try {
      console.log(`Updating fund ${id}:`, fund);
      const response = await axios.put(`${API_URL}/funds/${id}`, fund);
      return response.data;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log(`Deleting fund with id: ${id}`);
      await axios.delete(`${API_URL}/funds/${id}`);
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}

export default new FundService(); 