import axios from 'axios';
import { API_URL } from '../config';

export interface Volunteer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateVolunteerDTO {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
}

export interface UpdateVolunteerDTO extends Partial<CreateVolunteerDTO> {
  status?: 'active' | 'inactive' | 'pending';
  totalHours?: number;
}

class VolunteerService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_URL}/volunteers`;
  }

  async getVolunteers(): Promise<Volunteer[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      throw error;
    }
  }

  async getVolunteerById(id: string): Promise<Volunteer> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching volunteer:', error);
      throw error;
    }
  }

  async createVolunteer(volunteerData: Omit<Volunteer, '_id' | 'createdAt' | 'updatedAt'>): Promise<Volunteer> {
    try {
      const response = await axios.post(this.baseUrl, volunteerData);
      return response.data;
    } catch (error) {
      console.error('Error creating volunteer:', error);
      throw error;
    }
  }

  async updateVolunteer(id: string, volunteerData: Partial<Volunteer>): Promise<Volunteer> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, volunteerData);
      return response.data;
    } catch (error) {
      console.error('Error updating volunteer:', error);
      throw error;
    }
  }

  async updateVolunteerStatus(id: string, status: Volunteer['status']): Promise<Volunteer> {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      throw error;
    }
  }

  async deleteVolunteer(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      throw error;
    }
  }

  async updateHours(id: string, hours: number): Promise<Volunteer> {
    const response = await axios.patch(`${API_URL}/volunteers/${id}/hours`, { hours });
    return response.data;
  }
}

export const volunteerService = new VolunteerService(); 