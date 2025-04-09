import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CardMedia,
  CardActionArea,
  CardActions,
  Button,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { CalendarToday, Category } from '@mui/icons-material';
import newsService, { NewsArticle } from '../../services/newsService';
import { Skeleton } from '@mui/material';

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

const News: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getAllNews('published');
      if (response.success) {
        setNews(response.data);
        setError(null);
      } else {
        setError('Failed to load news articles. Please try again later.');
      }
      setNews(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Failed to load news articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchNews();
  };

  const NewsCardSkeleton = () => (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="rectangular" width={120} height={32} />
        </Box>
        <Box sx={{ mb: 1 }}>
          <Skeleton variant="text" height={28} />
        </Box>
        <Box>
          <Skeleton variant="text" height={20} style={{ marginBottom: '4px' }} />
          <Skeleton variant="text" height={20} />
        </Box>
      </CardContent>
      <CardActions>
        <Skeleton variant="rectangular" width={100} height={36} />
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ py: 8, px: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" height={48} width="60%" style={{ margin: '0 auto' }} />
          </Box>
          <Skeleton variant="text" height={24} width="40%" style={{ margin: '0 auto' }} />
        </Box>
        <Grid container spacing={4}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <NewsCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (news.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
        <Alert severity="info">
          No news articles available at the moment.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, px: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
          Latest News & Updates
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Stay informed about our latest initiatives and community impact
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {news.map((article) => (
          <Grid item xs={12} md={6} lg={4} key={article._id}>
            <GlassCard>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={article.image}
                  alt={article.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <Chip
                      icon={<Category />}
                      label={article.category}
                      size="small"
                      sx={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196F3' }}
                    />
                    <Chip
                      icon={<CalendarToday />}
                      label={new Date(article.date).toLocaleDateString()}
                      size="small"
                      sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {article.summary}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/news/${article._id}`)}
                >
                  Read More
                </Button>
              </CardActions>
            </GlassCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default News; 