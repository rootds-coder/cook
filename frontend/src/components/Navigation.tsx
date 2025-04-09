import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: 1,
              fontWeight: 700,
            }}
          >
            Fund Source
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Add any additional navigation items here */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation; 