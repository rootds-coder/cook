import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  History as HistoryIcon,
  AccountBalance as AccountIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface FundRequest {
  id: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({
    amount: '',
    purpose: ''
  });
  const [fundRequests, setFundRequests] = useState<FundRequest[]>([
    {
      id: '1',
      amount: 1000,
      purpose: 'Education Support',
      status: 'approved',
      date: '2024-03-18'
    },
    {
      id: '2',
      amount: 500,
      purpose: 'Healthcare',
      status: 'pending',
      date: '2024-03-19'
    }
  ]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewRequest({ amount: '', purpose: '' });
  };

  const handleSubmit = () => {
    const newFundRequest: FundRequest = {
      id: Date.now().toString(),
      amount: parseFloat(newRequest.amount),
      purpose: newRequest.purpose,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setFundRequests([...fundRequests, newFundRequest]);
    handleCloseDialog();
  };

  const stats = {
    totalRequested: fundRequests.reduce((sum, req) => sum + req.amount, 0),
    totalApproved: fundRequests
      .filter(req => req.status === 'approved')
      .reduce((sum, req) => sum + req.amount, 0),
    pendingRequests: fundRequests.filter(req => req.status === 'pending').length
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Welcome, {user?.username}!
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Fund Request
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AccountIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Total Requested</Typography>
            <Typography variant="h4">${stats.totalRequested.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AssessmentIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Total Approved</Typography>
            <Typography variant="h4">${stats.totalApproved.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <HistoryIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Pending Requests</Typography>
            <Typography variant="h4">{stats.pendingRequests}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Fund Requests History */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Your Fund Requests
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fundRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>{request.purpose}</TableCell>
                  <TableCell align="right">${request.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={
                        request.status === 'approved'
                          ? 'success'
                          : request.status === 'rejected'
                          ? 'error'
                          : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* New Request Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>New Fund Request</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={newRequest.amount}
              onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Purpose"
              value={newRequest.purpose}
              onChange={(e) => setNewRequest({ ...newRequest, purpose: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!newRequest.amount || !newRequest.purpose}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDashboard; 