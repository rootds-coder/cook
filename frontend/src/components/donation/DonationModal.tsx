import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';
import donationService, { DonationAmount } from '../../services/donationService';

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ open, onClose }) => {
  const [amounts, setAmounts] = useState<DonationAmount[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAmounts = async () => {
      try {
        setError(null);
        setLoading(true);
        const donationAmounts = await donationService.getDonationAmounts();
        setAmounts(donationAmounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load donation amounts');
        console.error('Error fetching amounts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchAmounts();
      // Reset state when modal opens
      setSelectedAmount(null);
      setCustomAmount('');
      setQrCode(null);
      setError(null);
    }
  }, [open]);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setQrCode(null);
    setError(null);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
      setQrCode(null);
      setError(null);
    }
  };

  const handleGenerateQR = async () => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || amount <= 0) {
      setError('Please select or enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await donationService.generateQR(amount);
      setQrCode(response.qrCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
      console.error('Error generating QR:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Make a Donation</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="body1" gutterBottom>
          Select an amount to donate:
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {amounts.map((amount) => (
            <Grid item xs={6} sm={4} key={amount.value}>
              <Button
                variant={selectedAmount === amount.value ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => handleAmountSelect(amount.value)}
                disabled={loading}
              >
                {amount.label}
              </Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              Or enter a custom amount:
            </Typography>
            <TextField
              fullWidth
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Enter amount in INR"
              disabled={loading}
              error={!!customAmount && (isNaN(Number(customAmount)) || Number(customAmount) <= 0)}
              helperText={
                customAmount && (isNaN(Number(customAmount)) || Number(customAmount) <= 0)
                  ? 'Please enter a valid amount'
                  : ''
              }
            />
          </Grid>
        </Grid>

        {(selectedAmount || customAmount) && !qrCode && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateQR}
              disabled={loading || (!selectedAmount && (!customAmount || Number(customAmount) <= 0))}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate QR Code'}
            </Button>
          </Box>
        )}

        {qrCode && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <img src={qrCode} alt="Donation QR Code" style={{ maxWidth: '100%', height: 'auto' }} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Scan this QR code with your UPI payment app to complete the donation
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setQrCode(null);
                setSelectedAmount(null);
                setCustomAmount('');
              }}
              sx={{ mt: 2 }}
            >
              Generate New QR Code
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DonationModal; 