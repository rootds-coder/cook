import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import donationService, { DonationAmount } from '../../services/donationService';

const PageWrapper = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(17, 25, 40, 0.95), rgba(17, 25, 40, 0.95))',
  minHeight: '100vh',
  color: 'white',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2196F3',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#2196F3',
    },
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    color: 'white',
  },
  '& .MuiDialogTitle-root': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: 'white',
  },
  '& .MuiButton-root': {
    color: '#2196F3',
  },
}));

const Donate: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [upiUrl, setUpiUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [donationAmounts, setDonationAmounts] = useState<DonationAmount[]>([]);

  useEffect(() => {
    const fetchDonationAmounts = async () => {
      try {
        const amounts = await donationService.getDonationAmounts();
        setDonationAmounts(amounts);
      } catch (error) {
        console.error('Error fetching donation amounts:', error);
      }
    };

    fetchDonationAmounts();
  }, []);

  const handleAmountClick = (value: number) => {
    setAmount(value.toString());
  };

  const handleDonate = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await donationService.generateQR(Number(amount));
      setQrCode(response.qrCode);
      if (response.upiUrl) {
        setUpiUrl(response.upiUrl);
      }
      setOpenQRDialog(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container maxWidth="lg">
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Make a Donation
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            Your contribution helps us create positive change in communities
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <GlassCard>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Select Amount
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {donationAmounts.map((option) => (
                    <Grid item xs={6} sm={4} key={option.value}>
                      <Button
                        fullWidth
                        variant={amount === option.value.toString() ? "contained" : "outlined"}
                        onClick={() => handleAmountClick(option.value)}
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                          color: amount === option.value.toString() ? 'white' : 'rgba(255, 255, 255, 0.9)',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                          },
                          ...(amount === option.value.toString() && {
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          })
                        }}
                      >
                        ₹{option.value}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="h6" gutterBottom>
                  Or Enter Custom Amount
                </Typography>
                <StyledTextField
                  fullWidth
                  label="Amount (₹)"
                  variant="outlined"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleDonate}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    borderRadius: 2,
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Proceed to Pay'}
                </Button>
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>

        <StyledDialog
          open={openQRDialog}
          onClose={() => setOpenQRDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center' }}>
            Scan QR Code to Pay
          </DialogTitle>
          <DialogContent>
            <Box sx={{ 
              textAlign: 'center', 
              py: 3,
              px: 2,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              my: 2
            }}>
              <img 
                src={`data:image/png;base64,${qrCode}`} 
                alt="Payment QR Code"
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  background: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}
              />
              {upiUrl && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.9)' }}>
                    Or click below to pay using UPI
                  </Typography>
                  <Button
                    variant="outlined"
                    href={upiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#2196F3',
                      borderColor: '#2196F3',
                      '&:hover': {
                        borderColor: '#21CBF3',
                        background: 'rgba(33, 150, 243, 0.1)',
                      }
                    }}
                  >
                    Pay with UPI
                  </Button>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
            <Button 
              onClick={() => setOpenQRDialog(false)}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </StyledDialog>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert 
            onClose={() => setError('')} 
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </PageWrapper>
  );
};

export default Donate; 