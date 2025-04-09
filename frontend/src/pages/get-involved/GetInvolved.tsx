import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Stack,
  IconButton,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import QRCodeDialog from '../../components/shared/QRCodeDialog';
import AmountConfirmationDialog from '../../components/shared/AmountConfirmationDialog';

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
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
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

const GetInvolved: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [volunteerFormData, setVolunteerFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    availability: 'full-time',
    message: ''
  });

  const [openVolunteerDialog, setOpenVolunteerDialog] = useState(false);
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [openAmountConfirmation, setOpenAmountConfirmation] = useState(false);
  const [donationAmount, setDonationAmount] = useState(5000); // Default amount

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'f1ad7e35-2295-41ad-8ffe-823678161830',
          ...formData,
          subject: 'New Contact Form Submission from Root Coder Foundation'
        })
      });

      const result = await response.json();

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Thank you for your message! We will get back to you soon.',
          severity: 'success'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again later.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/volunteer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...volunteerFormData,
          type: 'volunteer_request',
          status: 'unread'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit volunteer request');
      }

      setSnackbar({
        open: true,
        message: 'Your volunteer application has been submitted successfully! We will contact you soon.',
        severity: 'success'
      });

      setVolunteerFormData({
        name: '',
        email: '',
        phone: '',
        skills: '',
        availability: 'full-time',
        message: ''
      });
      setOpenVolunteerDialog(false);

    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to submit volunteer request. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleDonateClick = () => {
    setOpenAmountConfirmation(true);
  };

  const handleConfirmAmount = () => {
    setOpenAmountConfirmation(false);
    setOpenQRDialog(true);
  };

  const volunteerOpportunities = [
    {
      title: "Teaching Assistant",
      icon: <SchoolIcon />,
      description: "Help students with their studies in our after-school programs",
      commitment: "4-6 hours/week",
      location: "Various locations in Delhi NCR"
    },
    {
      title: "Medical Camp Volunteer",
      icon: <LocalHospitalIcon />,
      description: "Assist in organizing and managing medical camps in rural areas",
      commitment: "Weekend camps",
      location: "Rural Maharashtra"
    },
    {
      title: "Community Organizer",
      icon: <GroupsIcon />,
      description: "Help organize community events and awareness programs",
      commitment: "Flexible hours",
      location: "Pan India"
    }
  ];

  const impactMetrics = [
    {
      metric: "1000+",
      description: "Active Volunteers"
    },
    {
      metric: "50+",
      description: "Partner Organizations"
    },
    {
      metric: "100,000+",
      description: "Lives Impacted"
    }
  ];

  return (
    <PageWrapper>
      <Container maxWidth="lg">
        {/* Hero Section */}
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
            Join Our Mission
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            Be part of the change - every contribution makes a difference
          </Typography>
        </Box>

        {/* Impact Metrics */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {impactMetrics.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <GlassCard sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#2196F3',
                      fontWeight: 700,
                      mb: 2
                    }}
                  >
                    {item.metric}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        {/* Ways to Contribute */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <GlassCard sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CurrencyRupeeIcon sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                  <Typography variant="h4">Donate 5000 RS</Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#2196F3' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="100% of your donation goes directly to projects"
                      sx={{ color: 'rgba(255,255,255,0.9)' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#2196F3' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Tax benefits under 80G"
                      sx={{ color: 'rgba(255,255,255,0.9)' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#2196F3' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Regular updates on project impact"
                      sx={{ color: 'rgba(255,255,255,0.9)' }}
                    />
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleDonateClick}
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    borderRadius: 2,
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                    }
                  }}
                >
                  Donate Now
                </Button>
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <GlassCard sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <VolunteerActivismIcon sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                  <Typography variant="h4">Volunteer</Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#2196F3' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Flexible time commitment"
                      sx={{ color: 'rgba(255,255,255,0.9)' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#2196F3' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Training and support provided"
                      sx={{ color: 'rgba(255,255,255,0.9)' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#2196F3' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Certificate of appreciation"
                      sx={{ color: 'rgba(255,255,255,0.9)' }}
                    />
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setOpenVolunteerDialog(true)}
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    borderRadius: 2,
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                    }
                  }}
                >
                  Join as Volunteer
                </Button>
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>

        {/* Current Opportunities */}
        <Typography variant="h4" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>
          Current Volunteer Opportunities
        </Typography>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {volunteerOpportunities.map((opportunity, index) => (
            <Grid item xs={12} md={4} key={index}>
              <GlassCard sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ color: '#2196F3', mr: 2 }}>
                      {opportunity.icon}
                    </Box>
                    <Typography variant="h5">{opportunity.title}</Typography>
                  </Box>
                  <Typography 
                    sx={{ 
                      mb: 2,
                      color: 'rgba(255,255,255,0.9)'
                    }}
                  >
                    {opportunity.description}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      mb: 1
                    }}
                  >
                    Time Commitment: {opportunity.commitment}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Location: {opportunity.location}
                  </Typography>
                </CardContent>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form */}
        <GlassCard>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>Get in Touch</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      borderRadius: 2,
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                      }
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </GlassCard>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Dialog 
          open={openVolunteerDialog} 
          onClose={() => setOpenVolunteerDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Volunteer Application</DialogTitle>
          <DialogContent>
            <form onSubmit={handleVolunteerSubmit}>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    value={volunteerFormData.name}
                    onChange={(e) => setVolunteerFormData({ ...volunteerFormData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    value={volunteerFormData.email}
                    onChange={(e) => setVolunteerFormData({ ...volunteerFormData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Phone Number"
                    value={volunteerFormData.phone}
                    onChange={(e) => setVolunteerFormData({ ...volunteerFormData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Skills"
                    placeholder="e.g., Teaching, First Aid, Cooking"
                    value={volunteerFormData.skills}
                    onChange={(e) => setVolunteerFormData({ ...volunteerFormData, skills: e.target.value })}
                    helperText="List your relevant skills, separated by commas"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    required
                    fullWidth
                    label="Availability"
                    value={volunteerFormData.availability}
                    onChange={(e) => setVolunteerFormData({ ...volunteerFormData, availability: e.target.value })}
                  >
                    <MenuItem value="full-time">Full Time</MenuItem>
                    <MenuItem value="part-time">Part Time</MenuItem>
                    <MenuItem value="weekends">Weekends Only</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Why do you want to volunteer?"
                    value={volunteerFormData.message}
                    onChange={(e) => setVolunteerFormData({ ...volunteerFormData, message: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      mt: 2,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                      }
                    }}
                  >
                    Submit Application
                  </Button>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
        </Dialog>

        <QRCodeDialog
          open={openQRDialog}
          onClose={() => setOpenQRDialog(false)}
          amount={donationAmount}
        />

        <AmountConfirmationDialog
          open={openAmountConfirmation}
          onClose={() => setOpenAmountConfirmation(false)}
          amount={donationAmount}
          onConfirm={handleConfirmAmount}
        />
      </Container>
    </PageWrapper>
  );
};

export default GetInvolved; 