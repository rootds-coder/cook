import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Paper,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useTheme
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import paymentConfig from '../../config/payment';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import BrandSlider from '../shared/BrandSlider';
import News from './News';
import donationService from '../../services/donationService';
import QRCodeDialog from '../shared/QRCodeDialog';
import RevealOnScroll from '../shared/RevealOnScroll';
import { HelpRequestButton } from '../help/HelpRequestButton';

const MainBackground = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'url("/images/bg-charity.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: 0.3,
  zIndex: 0,
});

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 1,
  backgroundColor: 'rgba(17, 25, 40, 0.85)',
  minHeight: '100vh'
});

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(17, 25, 40, 0.85) 0%, rgba(33, 150, 243, 0.75) 100%)',
  position: 'relative',
  color: 'white',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(33, 150, 243, 0.3) 0%, transparent 70%)',
    pointerEvents: 'none'
  }
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
}));

const GlassDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'rgba(17, 25, 40, 0.95)',
    backdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.125)',
    borderRadius: 16,
    color: '#ffffff',
    overflow: 'hidden',
    maxWidth: '400px',
    width: '100%',
    margin: theme.spacing(2),
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
      overflow: 'hidden'
    }
  }
}));

const GlassBox = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 12,
  padding: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(10px)',
}));

const QRCodeBox = styled(Box)(({ theme }) => ({
  width: '300px',
  height: '300px',
  margin: '20px auto',
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: '2px solid transparent',
    borderRadius: 16,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
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

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  color: theme.palette.common.white,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'rgba(17, 25, 40, 0.7)',
  backdropFilter: 'blur(16px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.125)',
  borderRadius: 16,
  color: theme.palette.common.white,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const DonateSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, rgba(17, 25, 40, 0.95) 0%, rgba(33, 150, 243, 0.8) 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(33, 150, 243, 0.2) 0%, transparent 70%)',
    pointerEvents: 'none'
  }
}));

const GlassInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: 8,
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const AmountButton = styled(Button)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 8,
  color: 'white',
  padding: '16px',
  width: '100%',
  fontSize: '1.1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(33, 150, 243, 0.2)',
    borderColor: '#2196F3',
    transform: 'translateY(-2px)'
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
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: '2px solid transparent',
    borderRadius: 12,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  }
}));

const SuccessMessage = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.2))',
  borderRadius: 12,
  margin: theme.spacing(2, 0),
  border: '1px solid rgba(76, 175, 80, 0.3)',
  animation: 'fadeIn 0.5s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(-10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  }
}));

const AmountSelectionDialog = styled(GlassDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '400px',
    width: '100%',
    margin: theme.spacing(2),
    background: 'rgba(17, 25, 40, 0.95)',
    backdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.125)',
    borderRadius: 16,
    color: '#ffffff'
  }
}));

const AmountOption = styled(Button)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 8,
  color: 'white',
  padding: '16px',
  width: '100%',
  fontSize: '1.2rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(33, 150, 243, 0.2)',
    borderColor: '#2196F3',
    transform: 'translateY(-2px)'
  },
  '&.selected': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    borderColor: '#2196F3',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  }
}));

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [openQR, setOpenQR] = useState(false);
  const [timeLeft, setTimeLeft] = useState(paymentConfig.timeoutSeconds);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'timeout' | 'failed'>('pending');
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [paymentVerificationCount, setPaymentVerificationCount] = useState(0);
  const maxVerificationAttempts = 12; // 1 minute (5 seconds * 12)
  const [openAmountSelect, setOpenAmountSelect] = useState(false);
  const [openAmountDialog, setOpenAmountDialog] = useState(false);
  const [selectedPresetAmount, setSelectedPresetAmount] = useState<string | null>(null);
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState(5000); // Default amount

  useEffect(() => {
    let verificationTimer: NodeJS.Timeout;
    
    if (openQR && paymentStatus === 'pending') {
      verificationTimer = setInterval(() => {
        setPaymentVerificationCount((prev) => {
          if (prev >= maxVerificationAttempts) {
            clearInterval(verificationTimer);
            setPaymentStatus('timeout');
            return prev;
          }
          // Here you would add your UPI payment verification logic
          // For now, we'll just increment the counter
          return prev + 1;
        });
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (verificationTimer) {
        clearInterval(verificationTimer);
      }
    };
  }, [openQR, paymentStatus]);

  const timerPercentage = (timeLeft / paymentConfig.timeoutSeconds) * 100;

  const generateQRCode = async (amount: string) => {
    try {
      setLoading(true);
      const response = await donationService.generateQR(Number(amount));
      setQrCode(response.qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    try {
      setLoading(true);
      setOpenQR(true);
      await generateQRCode(amount);
      startTimer();
    } catch (error) {
      console.error('Error in handleDonate:', error);
      alert('Failed to generate QR code. Please try again.');
      setOpenQR(false);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setPaymentStatus('failed');
          // Auto close after 3 seconds on failure
          setTimeout(() => {
            handleClose();
          }, 3000);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleClose = () => {
    setOpenQR(false);
    setTimeLeft(paymentConfig.timeoutSeconds);
    setPaymentStatus('pending');
  };

  // Simulate payment success (replace with actual payment verification)
  const simulatePaymentSuccess = () => {
    setPaymentStatus('success');
  };

  // Update project images to use actual images instead of Unsplash
  const projectImages = [
    {
      title: "Education Support",
      description: "Providing educational resources and support to underprivileged children, ensuring they have access to quality education.",
      image: "/images/bg-charity.jpg"
    },
    {
      title: "Healthcare Initiative",
      description: "Delivering essential healthcare services and medical supplies to communities in need.",
      image: "/images/medical.jpg"
    },
    {
      title: "Community Development",
      description: "Building sustainable infrastructure and empowering local communities through various development programs.",
      image: "/images/community.jpg"
    }
  ];

  // Predefined donation amounts
  const donationAmounts = [
    { label: '₹100', value: '100' },
    { label: '₹500', value: '500' },
    { label: '₹1000', value: '1000' },
    { label: '₹5000', value: '5000' }
  ];

  const handleTopDonate = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    handleDonate();
  };

  const handleBottomDonate = () => {
    setOpenAmountDialog(true);
    setAmount('');
    setSelectedPresetAmount(null);
  };

  const handleAmountSelect = (selectedAmount: string) => {
    setAmount(selectedAmount);
    setOpenAmountSelect(false);
    handleDonate();
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleDonateClick = () => {
    setOpenQRDialog(true);
  };

  const handleProceedToPayment = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setOpenAmountDialog(false);
    handleDonate();
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setSelectedPresetAmount(null);
  };

  // Create separate buttons for top and bottom sections
  const topDonateButton = (
    <Button
      variant="contained"
      size="large"
      onClick={handleTopDonate}
      fullWidth
      sx={{
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        borderRadius: 2,
        height: 56,
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        '&:hover': {
          background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
        }
      }}
    >
      Donate Now
    </Button>
  );

  const bottomDonateButton = (
    <Button
      variant="contained"
      size="large"
      onClick={handleBottomDonate}
      fullWidth
      sx={{
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        borderRadius: 2,
        height: 56,
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        '&:hover': {
          background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
        }
      }}
    >
      Donate Now
    </Button>
  );

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <MainBackground />
      <ContentWrapper>
        <RevealOnScroll>
          <HeroSection>
            <Container maxWidth="md">
              <Typography 
                variant="h1" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 700,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Make a Difference Today
              </Typography>
              <Typography 
                variant="h5" 
                paragraph
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: '800px',
                  margin: '0 auto',
                  mb: 4
                }}
              >
                Your contribution can change lives. Help us support those in need.
              </Typography>
            </Container>
          </HeroSection>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={200}>
          <DonateSection>
            <Container maxWidth="md">
              <Typography 
                variant="h3" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 600,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Donate Now
              </Typography>
              <Box sx={{ 
                maxWidth: 400, 
                mx: 'auto', 
                textAlign: 'center', 
                mt: 4,
                position: 'relative',
                zIndex: 1
              }}>
                <Stack spacing={2}>
                  <GlassInput
                    fullWidth
                    placeholder="Enter Amount (₹)"
                    variant="outlined"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }}>₹</Typography>
                      ),
                    }}
                  />
                  {topDonateButton}
                </Stack>
              </Box>
            </Container>
          </DonateSection>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={400}>
          {/* Our Story Section */}
          <Box sx={{ bgcolor: '#1a2332', py: 8, color: 'white' }}>
            <Container maxWidth="lg">
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 600,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 4
                }}
              >
                Our Story
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <GlassCard sx={{ height: '100%', p: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#2196F3' }}>
                      Our Mission
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }} paragraph>
                      Our foundation was established with a simple yet powerful mission: to provide
                      support to those in need. We believe that everyone deserves access to basic
                      necessities and opportunities for growth.
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }} paragraph>
                      Through your generous donations, we've been able to help countless individuals
                      and families overcome challenges and build better lives. But there's still
                      much work to be done.
                    </Typography>
                  </GlassCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <GlassCard sx={{ height: '100%', p: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#2196F3' }}>
                      Your Impact
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }} paragraph>
                      Your contribution goes directly to supporting various initiatives:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, color: 'rgba(255,255,255,0.8)' }}>
                      <Typography component="li" paragraph>
                        Educational programs for underprivileged children
                      </Typography>
                      <Typography component="li" paragraph>
                        Healthcare support for families in need
                      </Typography>
                      <Typography component="li" paragraph>
                        Community development projects
                      </Typography>
                      <Typography component="li" paragraph>
                        Emergency relief efforts
                      </Typography>
                    </Box>
                  </GlassCard>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </RevealOnScroll>

        {/* Impact Statistics */}
        <RevealOnScroll direction="up" delay={600}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, rgba(17, 25, 40, 0.95) 0%, rgba(33, 150, 243, 0.8) 100%)',
            py: 8 
          }}>
            <Container maxWidth="lg">
              <Grid container spacing={4}>
                {[
                  { number: '1000+', label: 'Lives Impacted' },
                  { number: '₹500K+', label: 'Funds Raised' },
                  { number: '50+', label: 'Projects Completed' }
                ].map((stat, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <StatsCard sx={{ p: 4 }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            color: '#2196F3',
                            fontWeight: 700,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            mb: 2
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography 
                          variant="h6"
                          sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 500
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </CardContent>
                    </StatsCard>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </RevealOnScroll>

        {/* Trusted Organizations */}
        <RevealOnScroll direction="up" delay={800}>
          <Box sx={{ py: 4, bgcolor: 'transparent' }}>
            <Container maxWidth="lg" sx={{ mb: 4 }}>
              <Typography 
                variant="h4" 
                align="center" 
                sx={{ 
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.9)',
                  mb: 3
                }}
              >
                Trusted by Leading Organizations
              </Typography>
            </Container>
            <BrandSlider />
          </Box>
        </RevealOnScroll>

        {/* Recent Projects */}
        <RevealOnScroll direction="up" delay={1000}>
          <Box sx={{ bgcolor: '#1a2332', py: 8, color: 'white' }}>
            <Container maxWidth="lg">
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 600,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 6
                }}
              >
                Recent Projects
              </Typography>
              <Grid container spacing={4}>
                {projectImages.map((project, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <GlassCard sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={project.image}
                        alt={project.title}
                        sx={{ borderRadius: '16px 16px 0 0' }}
                      />
                      <CardContent>
                        <Typography 
                          gutterBottom 
                          variant="h5" 
                          component="h3"
                          sx={{ color: '#2196F3' }}
                        >
                          {project.title}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {project.description}
                        </Typography>
                      </CardContent>
                    </GlassCard>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </RevealOnScroll>

        {/* Bottom Call to Action */}
        <RevealOnScroll direction="up" delay={1200}>
          <Box sx={{ 
            background: 'linear-gradient(45deg, rgba(17, 25, 40, 0.95) 0%, rgba(33, 150, 243, 0.8) 100%)',
            color: 'white', 
            py: 8,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(33, 150, 243, 0.2) 0%, transparent 70%)',
              pointerEvents: 'none'
            }
          }}>
            <Container maxWidth="lg">
              <Typography 
                variant="h3" 
                align="center" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Ready to Make a Difference?
              </Typography>
              <Typography 
                variant="h6" 
                align="center" 
                paragraph
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4
                }}
              >
                Join us in our mission to create positive change.
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                {bottomDonateButton}
              </Box>
            </Container>
          </Box>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={1400}>
          <News />
        </RevealOnScroll>

        {/* Amount Selection Dialog */}
        <AmountSelectionDialog
          open={openAmountDialog}
          onClose={() => setOpenAmountDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            textAlign: 'center',
            color: '#2196F3',
            fontWeight: 600,
            fontSize: '1.5rem',
            pb: 1,
            pt: 2
          }}>
            Select Donation Amount
          </DialogTitle>
          <DialogContent>
            <Box sx={{ py: 2 }}>
              <Grid container spacing={2}>
                {[100, 500, 1000, 2000, 5000].map((amount) => (
                  <Grid item xs={6} key={amount}>
                    <AmountOption
                      onClick={() => handleAmountSelect(amount.toString())}
                      className={selectedPresetAmount === amount.toString() ? 'selected' : ''}
                    >
                      ₹{amount}
                    </AmountOption>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" gutterBottom sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Or enter custom amount:
                </Typography>
                <GlassInput
                  fullWidth
                  placeholder="Enter Amount (₹)"
                  variant="outlined"
                  value={amount}
                  onChange={handleCustomAmountChange}
                  type="number"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button 
              onClick={() => setOpenAmountDialog(false)}
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProceedToPayment}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                }
              }}
            >
              Proceed to Payment
            </Button>
          </DialogActions>
        </AmountSelectionDialog>

        {/* QR Code Display */}
        {qrCode && (
          <GlassDialog
            open={openQR}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ 
              textAlign: 'center',
              color: paymentStatus === 'failed' ? '#f44336' : '#2196F3',
              fontWeight: 600,
              fontSize: '1.5rem',
              pb: 1,
              pt: 2
            }}>
              {paymentStatus === 'success' ? 'धन्यवाद!' : 
               paymentStatus === 'failed' ? 'Payment Failed' : 
               'Scan QR Code to Donate'}
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
                ) : paymentStatus === 'success' ? (
                  <SuccessMessage>
                    <Typography variant="h5" gutterBottom sx={{ color: '#4CAF50', fontWeight: 600 }}>
                      आपका दिन शुभ हो!
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                      Thank you for your generous donation of ₹{amount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Your contribution will help us make a difference in the lives of those in need.
                    </Typography>
                  </SuccessMessage>
                ) : paymentStatus === 'failed' ? (
                  <Box sx={{
                    textAlign: 'center',
                    padding: 4,
                    background: 'linear-gradient(45deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.2))',
                    borderRadius: 2,
                    margin: '16px 0',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    animation: 'fadeIn 0.5s ease-in-out'
                  }}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#f44336', fontWeight: 600 }}>
                      Payment Timeout
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                      The payment session has expired.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Please try again with a new QR code.
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
                        Time remaining: {timeLeft} seconds
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
                  background: paymentStatus === 'failed' ? 
                    'linear-gradient(45deg, #f44336 30%, #ff5252 90%)' : 
                    'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  borderRadius: 2,
                  py: 1,
                  '&:hover': {
                    background: paymentStatus === 'failed' ? 
                      'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)' : 
                      'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                  }
                }}
              >
                {paymentStatus === 'success' ? 'Close' : 
                 paymentStatus === 'failed' ? 'Try Again' : 
                 'Cancel'}
              </Button>
            </DialogActions>
          </GlassDialog>
        )}

        <QRCodeDialog
          open={openQRDialog}
          onClose={() => setOpenQRDialog(false)}
          amount={donationAmount}
        />
        <HelpRequestButton />
      </ContentWrapper>
    </Box>
  );
};

export default LandingPage; 