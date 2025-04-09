import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Link,
  IconButton
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import DonationModal from './donation/DonationModal';

const Footer: React.FC = () => {
  const [donationModalOpen, setDonationModalOpen] = useState(false);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Fund Source
            </Typography>
            <Typography variant="body2">
              Empowering communities through sustainable funding solutions.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" color="inherit" underline="none">
                About Us
              </Link>
              <Link href="/projects" color="inherit" underline="none">
                Projects
              </Link>
              <Link href="/get-involved" color="inherit" underline="none">
                Get Involved
              </Link>
              <Link href="/success-stories" color="inherit" underline="none">
                Success Stories
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setDonationModalOpen(true)}
              sx={{ mt: 2 }}
            >
              Donate Now
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Fund Source. All rights reserved.
          </Typography>
        </Box>
      </Container>

      <DonationModal
        open={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
      />
    </Box>
  );
};

export default Footer; 