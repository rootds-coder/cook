import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Overview from '../../components/admin/Overview';
import DonationManagement from '../../components/admin/DonationManagement';
import VolunteerManagement from '../../components/admin/VolunteerManagement';
import NewsManagement from '../../components/admin/NewsManagement';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: 'rgba(17, 25, 40, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
}));

const StyledListItem = styled(ListItem)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
  ...(selected && {
    background: 'rgba(33, 150, 243, 0.2)',
    '&:hover': {
      background: 'rgba(33, 150, 243, 0.3)',
    },
  }),
}));

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setMobileOpen(false);
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Admin Panel
        </Typography>
      </Box>
      <List>
        <StyledListItem
          selected={activeTab === 'overview'}
          onClick={(e) => handleTabChange(e, 'overview')}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </StyledListItem>
        <StyledListItem
          selected={activeTab === 'donations'}
          onClick={(e) => handleTabChange(e, 'donations')}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Donations" />
        </StyledListItem>
        <StyledListItem
          selected={activeTab === 'volunteers'}
          onClick={(e) => handleTabChange(e, 'volunteers')}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Volunteers" />
        </StyledListItem>
        <StyledListItem
          selected={activeTab === 'news'}
          onClick={(e) => handleTabChange(e, 'news')}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="News" />
        </StyledListItem>
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'donations':
        return <DonationManagement />;
      case 'volunteers':
        return <VolunteerManagement />;
      case 'news':
        return <NewsManagement />;
      default:
        return <Overview />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={() => setMobileOpen(!mobileOpen)}
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: theme.zIndex.drawer + 1,
          color: 'white',
          display: { sm: 'none' },
        }}
      >
        <MenuIcon />
      </IconButton>
      <StyledDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
        }}
      >
        {drawer}
      </StyledDrawer>
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        {drawer}
      </StyledDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard; 