import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  TextField,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

interface HelpRequest {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'inProgress' | 'resolved';
  createdAt: string;
  email?: string;
  name?: string;
}

const HelpRequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/v1/help-requests/all');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch help requests');
      }
    } catch (error) {
      console.error('Error fetching help requests:', error);
      setError('Network error while fetching help requests');
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/v1/help-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchRequests();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update request status');
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      setError('Network error while updating status');
    }
    handleMenuClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, request: HelpRequest) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(request);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequest(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffa726';
      case 'inProgress': return '#2196f3';
      case 'resolved': return '#4caf50';
      default: return '#757575';
    }
  };

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2">
          Help Requests Management
        </Typography>
        <TextField
          size="small"
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 250 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No help requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request._id} hover>
                  <TableCell>{request.title}</TableCell>
                  <TableCell>{request.description}</TableCell>
                  <TableCell>
                    {request.email || request.name ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {request.name || 'Anonymous'}
                        {request.email && (
                          <Tooltip title={`Email: ${request.email}`}>
                            <IconButton 
                              size="small" 
                              onClick={() => window.location.href = `mailto:${request.email}`}
                            >
                              <EmailIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    ) : (
                      'Anonymous'
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(request.status)}20`,
                        color: getStatusColor(request.status),
                        fontWeight: 'medium',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, request)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => selectedRequest && handleStatusChange(selectedRequest._id, 'pending')}
          disabled={selectedRequest?.status === 'pending'}
        >
          Mark as Pending
        </MenuItem>
        <MenuItem 
          onClick={() => selectedRequest && handleStatusChange(selectedRequest._id, 'inProgress')}
          disabled={selectedRequest?.status === 'inProgress'}
        >
          Mark as In Progress
        </MenuItem>
        <MenuItem 
          onClick={() => selectedRequest && handleStatusChange(selectedRequest._id, 'resolved')}
          disabled={selectedRequest?.status === 'resolved'}
        >
          Mark as Resolved
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HelpRequestManagement;
