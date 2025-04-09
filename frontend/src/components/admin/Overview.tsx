import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Payment as PaymentIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import newsService, { NewsArticle } from '../../services/newsService';
import donationService from '../../services/donationService';
import { volunteerService } from '../../services/volunteerService';

interface Donation {
  amount: number;
}

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(17, 25, 40, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <StyledCard>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            background: `${color}20`,
            borderRadius: '50%',
            p: 1,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ color }}>
        {value}
      </Typography>
    </CardContent>
  </StyledCard>
);

const Overview: React.FC = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalVolunteers: 0,
    totalNews: 0,
    totalAmount: 0,
  });
  const [recentNews, setRecentNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentNews();
  }, []);

  const fetchStats = async () => {
    try {
      const [donations, volunteers, newsResponse] = await Promise.all([
        donationService.getDonations(),
        volunteerService.getVolunteers(),
        newsService.getAllNews(),
      ]);

      const totalAmount = donations.reduce((sum: number, donation: Donation) => sum + donation.amount, 0);

      setStats({
        totalDonations: donations.length,
        totalVolunteers: volunteers.length,
        totalNews: newsResponse.success ? newsResponse.data.length : 0,
        totalAmount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentNews = async () => {
    try {
      const response = await newsService.getAllNews('published');
      if (response.success) {
        setRecentNews(response.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching recent news:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Donations"
            value={stats.totalDonations}
            icon={<PaymentIcon sx={{ color: '#2196F3' }} />}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Amount"
            value={`₹${stats.totalAmount.toLocaleString()}`}
            icon={<TrendingUpIcon sx={{ color: '#4CAF50' }} />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Volunteers"
            value={stats.totalVolunteers}
            icon={<PeopleIcon sx={{ color: '#FF9800' }} />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Published News"
            value={stats.totalNews}
            icon={<ArticleIcon sx={{ color: '#9C27B0' }} />}
            color="#9C27B0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Recent News
              </Typography>
              <List>
                {recentNews.map((item, index) => (
                  <React.Fragment key={item._id}>
                    <ListItem>
                      <ListItemIcon>
                        <ArticleIcon sx={{ color: '#9C27B0' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={`By ${item.author} • ${new Date(item.publishedAt || '').toLocaleDateString()}`}
                        primaryTypographyProps={{ sx: { color: 'white' } }}
                        secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                      />
                    </ListItem>
                    {index < recentNews.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview; 