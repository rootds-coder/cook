import React from 'react';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
  styled
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';

const FooterContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(17, 25, 40, 0.95)',
  backdropFilter: 'blur(16px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  padding: theme.spacing(4, 0, 2),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.3), transparent)'
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  transition: 'all 0.3s ease',
  padding: theme.spacing(1),
  '&:hover': {
    color: '#2196F3',
    transform: 'translateY(-2px)'
  }
}));

// Common styles for both types of links
const linkStyles = {
  color: 'rgba(255, 255, 255, 0.7)',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  fontSize: '0.9rem',
  '&:hover': {
    color: '#2196F3',
    transform: 'translateX(3px)'
  }
};

const StyledRouterLink = styled(RouterLink)(linkStyles);
const StyledMuiLink = styled(MuiLink)(linkStyles);

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Get Involved', path: '/get-involved' },
    { name: 'Success Stories', path: '/success-stories' },
    { name: 'FAQ', path: '/faq' }
  ];

  const socialLinks = [
    { icon: <GitHubIcon />, url: 'https://github.com/rootds-coder', name: 'GitHub' },
    { icon: <InstagramIcon />, url: '#', name: 'Instagram' },
    { icon: <LinkedInIcon />, url: '#', name: 'LinkedIn' },
    { icon: <TwitterIcon />, url: '#', name: 'Twitter' },
    { icon: <EmailIcon />, url: 'mailto:contact@example.com', name: 'Email' }
  ];

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Stack direction="row" spacing={3} justifyContent="center">
              {quickLinks.map((link) => (
                <StyledRouterLink
                  key={link.path}
                  to={link.path}
                >
                  {link.name}
                </StyledRouterLink>
              ))}
            </Stack>
          </Grid>

          {/* Social Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Stack direction="row" spacing={1} justifyContent="center">
              {socialLinks.map((social) => (
                <MuiLink
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'inherit',
                    '&:hover': { color: 'inherit' }
                  }}
                >
                  <SocialButton aria-label={social.name}>
                    {social.icon}
                  </SocialButton>
                </MuiLink>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 3,
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.8rem',
            fontWeight: 300
          }}
        >
          © {new Date().getFullYear()} Root Coder Foundation. Made with ❤️ by{' '}
          <StyledMuiLink
            href="https://github.com/rootds-coder"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#2196F3',
              '&:hover': {
                color: '#2196F3',
                textDecoration: 'underline'
              }
            }}
          >
            Root Coder
          </StyledMuiLink>
        </Typography>
      </Container>
    </FooterContainer>
  );
};

export default Footer; 