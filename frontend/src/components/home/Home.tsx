import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
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
  IconButton,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { HelpRequestButton } from '../help/HelpRequestButton';

interface Fund {
  id: string;
  name: string;
  amount: number;
  source: string;
  date: string;
  status: 'pending' | 'received' | 'rejected';
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [funds, setFunds] = useState<Fund[]>([
    // Sample data - replace with actual API calls
    {
      id: '1',
      name: 'Initial Funding',
      amount: 10000,
      source: 'Bank Transfer',
      date: '2024-03-20',
      status: 'received'
    }
  ]);
  const [newFund, setNewFund] = useState({
    name: '',
    amount: '',
    source: ''
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = () => {
    // Add new fund to the list
    const fund: Fund = {
      id: Date.now().toString(),
      name: newFund.name,
      amount: parseFloat(newFund.amount),
      source: newFund.source,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setFunds([...funds, fund]);
    handleCloseDialog();
    setNewFund({ name: '', amount: '', source: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Welcome, {user?.username}!
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Manage your funds and track transactions
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Add New Fund
            </Button>
          </Paper>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Funds
            </Typography>
            <Typography variant="h4" color="primary">
              ${funds.reduce((sum, fund) => sum + fund.amount, 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Pending Funds
            </Typography>
            <Typography variant="h4" color="warning.main">
              ${funds.filter(fund => fund.status === 'pending')
                .reduce((sum, fund) => sum + fund.amount, 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Received Funds
            </Typography>
            <Typography variant="h4" color="success.main">
              ${funds.filter(fund => fund.status === 'received')
                .reduce((sum, fund) => sum + fund.amount, 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        {/* Funds Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fund History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {funds.map((fund) => (
                    <TableRow key={fund.id}>
                      <TableCell>{fund.name}</TableCell>
                      <TableCell align="right">${fund.amount.toLocaleString()}</TableCell>
                      <TableCell>{fund.source}</TableCell>
                      <TableCell>{fund.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={fund.status}
                          color={getStatusColor(fund.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Fund Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Fund</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Fund Name"
              value={newFund.name}
              onChange={(e) => setNewFund({ ...newFund, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={newFund.amount}
              onChange={(e) => setNewFund({ ...newFund, amount: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Source"
              value={newFund.source}
              onChange={(e) => setNewFund({ ...newFund, source: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Fund
          </Button>
        </DialogActions>
      </Dialog>
      <HelpRequestButton />
    </Container>
  );
};

export default Home;