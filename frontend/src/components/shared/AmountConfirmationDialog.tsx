import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'rgba(17, 25, 40, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
}));

const StyledDialogTitle = styled(DialogTitle)({
  color: 'white',
  textAlign: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
});

const StyledDialogContent = styled(DialogContent)({
  padding: '24px',
  textAlign: 'center',
});

const StyledDialogActions = styled(DialogActions)({
  padding: '16px 24px',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
});

interface AmountConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
}

const AmountConfirmationDialog: React.FC<AmountConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  amount,
}) => {
  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <StyledDialogTitle>Confirm Donation Amount</StyledDialogTitle>
      <StyledDialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <CurrencyRupeeIcon sx={{ fontSize: 40, color: '#2196F3', mr: 1 }} />
          <Typography variant="h3" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
            {amount.toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          Please confirm that you want to proceed with this donation amount.
        </Typography>
      </StyledDialogContent>
      <StyledDialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: 'white',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
            },
          }}
        >
          Confirm & Proceed
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default AmountConfirmationDialog; 