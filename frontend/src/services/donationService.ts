import axios from 'axios';
import { API_URL } from '../config';

export interface DonationAmount {
  value: number;
  label: string;
}

export interface QRResponse {
  success: boolean;
  qrCode: string;
  amount: number;
  upiUrl?: string;
}

export interface Donation {
  _id: string;
  donorName: string;
  email: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

class DonationService {
  private handleApiError(error: any): never {
    console.error('API Error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(errorMessage);
  }

  async getDonations(): Promise<Donation[]> {
    try {
      const response = await axios.get(`${API_URL}/payment/admin/donations`);
      return response.data.donations;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getDonationById(id: string): Promise<Donation> {
    try {
      const response = await axios.get(`${API_URL}/payment/admin/donations/${id}`);
      return response.data.donation;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async updateDonationStatus(id: string, status: Donation['status']): Promise<Donation> {
    try {
      const response = await axios.patch(`${API_URL}/payment/admin/donations/${id}/status`, { status });
      return response.data.donation;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getDonationAmounts(): Promise<DonationAmount[]> {
    try {
      console.log('Fetching donation amounts from:', `${API_URL}/payment/amounts`);
      const response = await axios.get(`${API_URL}/payment/amounts`);
      return response.data.amounts;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async generateQR(amount: number): Promise<QRResponse> {
    try {
      // Validate amount
      if (!amount || isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount. Please provide a valid positive number.');
      }

      console.log('Generating QR code for amount:', amount);
      console.log('API URL:', `${API_URL}/payment/qr/generate`);

      const response = await axios.post(`${API_URL}/payment/qr/generate`, { 
        amount: Number(amount) 
      });

      console.log('QR code response:', response.data);

      if (!response.data.success || !response.data.qrCode) {
        throw new Error('Failed to generate QR code. Please try again.');
      }

      return response.data;
    } catch (error) {
      console.error('Error in generateQR:', error);
      return this.handleApiError(error);
    }
  }
}

export default new DonationService(); 