import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import donationService from '../../services/donationService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(17, 25, 40, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: 'white',
  borderColor: 'rgba(255, 255, 255, 0.1)',
}));

const DonationManagement: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await donationService.getDonations();
      setDonations(response);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Loading donations...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>
        Donation Management
      </Typography>
      <TableContainer component={StyledPaper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Donor</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation._id}>
                <StyledTableCell>{formatDate(donation.createdAt)}</StyledTableCell>
                <StyledTableCell>{donation.donorName}</StyledTableCell>
                <StyledTableCell>{formatAmount(donation.amount)}</StyledTableCell>
                <StyledTableCell>
                  <Chip
                    label={donation.status}
                    color={donation.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small" sx={{ color: 'white' }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DonationManagement; 