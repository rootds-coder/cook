import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import donationService from '../../services/donationService';

interface QRCodeDialogProps {
  open: boolean;
  onClose: () => void;
  amount: number;
}

const GlassDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'rgba(17, 25, 40, 0.95)',
    backdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.125)',
    borderRadius: 16,
    color: '#ffffff',
    maxWidth: '400px',
    width: '100%',
    margin: theme.spacing(2)
  }
}));

const QRCodeContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 12,
  padding: theme.spacing(3),
  margin: theme.spacing(1, 0),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '& img': {
    maxWidth: '280px',
    width: '100%',
    height: 'auto',
    marginBottom: theme.spacing(2),
    borderRadius: 8,
    padding: theme.spacing(2),
    background: '#fff'
  }
}));

const TimerProgress = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 4,
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 2,
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
}));

const TimerBar = styled(Box)<{ value: number }>(({ theme, value }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: `${value}%`,
  background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
  transition: 'width 1s linear',
}));

const QRCodeDialog: React.FC<QRCodeDialogProps> = ({ open, onClose, amount }) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const generateQR = async () => {
      if (!open) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log('Generating QR code for amount:', amount);
        const response = await donationService.generateQR(amount);
        console.log('QR code received:', response.qrCode);
        setQrCode(response.qrCode);
        setTimeLeft(300); // Reset timer
      } catch (err) {
        console.error('Error in QR code generation:', err);
        setError('Failed to generate QR code. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      generateQR();
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [open, amount]);

  const handleClose = () => {
    setQrCode('');
    setError(null);
    setTimeLeft(300);
    onClose();
  };

  const timerPercentage = (timeLeft / 300) * 100;

  return (
    <GlassDialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        textAlign: 'center',
        color: error ? '#f44336' : '#2196F3',
        fontWeight: 600,
        fontSize: '1.5rem',
        pb: 1,
        pt: 2
      }}>
        {error ? 'Error' : 'Scan QR Code to Donate'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center' }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '400px',
              gap: 2
            }}>
              <CircularProgress size={60} />
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Generating QR Code...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{
              textAlign: 'center',
              padding: 4,
              background: 'linear-gradient(45deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.2))',
              borderRadius: 2,
              margin: '16px 0',
              border: '1px solid rgba(244, 67, 54, 0.3)'
            }}>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                {error}
              </Typography>
            </Box>
          ) : (
            <>
              <QRCodeContainer>
                <img 
                  src={qrCode}
                  alt="Donation QR Code"
                />
                <Typography variant="h6" gutterBottom sx={{ color: '#2196F3', fontWeight: 600 }}>
                  ₹{amount}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Scan this QR code with your UPI payment app
                </Typography>
              </QRCodeContainer>
              <Box sx={{ mt: 2 }}>
                <TimerProgress>
                  <TimerBar value={timerPercentage} />
                </TimerProgress>
                <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
                  Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={handleClose}
          variant="contained"
          fullWidth
          sx={{
            background: error ? 
              'linear-gradient(45deg, #f44336 30%, #ff5252 90%)' : 
              'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            borderRadius: 2,
            py: 1,
            '&:hover': {
              background: error ? 
                'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)' : 
                'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
            }
          }}
        >
          {error ? 'Try Again' : 'Close'}
        </Button>
      </DialogActions>
    </GlassDialog>
  );
};

export default QRCodeDialog; 