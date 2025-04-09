import { styled } from '@mui/material/styles';
import { Box, Paper, Card } from '@mui/material';

export const DashboardCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 0 20px 0 rgba(76,87,125,.02)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 0 30px 0 rgba(76,87,125,.05)',
  },
}));

export const StatsNumber = styled('div')(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

export const TableContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  marginTop: theme.spacing(3),
}));

export const HeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 0 50px 0 rgba(82,63,105,.15)',
  padding: theme.spacing(2, 3),
  marginBottom: theme.spacing(4),
}));

export const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));
