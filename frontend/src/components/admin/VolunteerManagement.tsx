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
  Button,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { volunteerService } from '../../services/volunteerService';

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

const VolunteerManagement: React.FC = () => {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await volunteerService.getVolunteers();
      setVolunteers(response);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (volunteerId: string, newStatus: 'active' | 'pending' | 'inactive') => {
    try {
      await volunteerService.updateVolunteerStatus(volunteerId, newStatus);
      fetchVolunteers();
    } catch (error) {
      console.error('Error updating volunteer status:', error);
    }
  };

  const handleDelete = async (volunteerId: string) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      try {
        await volunteerService.deleteVolunteer(volunteerId);
        fetchVolunteers();
      } catch (error) {
        console.error('Error deleting volunteer:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Loading volunteers...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ color: 'white' }}>
          Volunteer Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {/* TODO: Implement add volunteer dialog */}}
        >
          Add Volunteer
        </Button>
      </Box>
      <TableContainer component={StyledPaper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {volunteers.map((volunteer) => (
              <TableRow key={volunteer._id}>
                <StyledTableCell>{volunteer.name}</StyledTableCell>
                <StyledTableCell>{volunteer.email}</StyledTableCell>
                <StyledTableCell>{volunteer.phone}</StyledTableCell>
                <StyledTableCell>
                  <Chip
                    label={volunteer.status}
                    color={
                      volunteer.status === 'active'
                        ? 'success'
                        : volunteer.status === 'pending'
                        ? 'warning'
                        : 'error'
                    }
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small" sx={{ color: 'white' }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" sx={{ color: 'white' }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      sx={{ color: 'white' }}
                      onClick={() => handleDelete(volunteer._id)}
                    >
                      <DeleteIcon />
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

export default VolunteerManagement; 