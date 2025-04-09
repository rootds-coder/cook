import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Card,
  CardMedia,
  Skeleton,
  Alert,
} from '@mui/material';
import { CalendarToday, Category, ArrowBack } from '@mui/icons-material';
import newsService, { NewsArticle } from '../../services/newsService';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const response = await newsService.getNewsById(id);
        if (response.success) {
          setArticle(response.data);
          setError(null);
        } else {
          setError('Failed to load the article. Please try again later.');
        }
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setError('Failed to load the article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 4 }} />
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={30} width="60%" sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height={200} />
      </Container>
    );
  }

  if (error || !article) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/news')}>
              Go Back
            </Button>
          }
        >
          {error || 'Article not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 4 }}
      >
        Back to News
      </Button>

      <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
        <CardMedia
          component="img"
          height="400"
          image={article.image}
          alt={article.title}
          sx={{ objectFit: 'cover' }}
        />
      </Card>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          {article.title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Chip
            icon={<Category />}
            label={article.category}
            sx={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196F3' }}
          />
          <Chip
            icon={<CalendarToday />}
            label={new Date(article.date).toLocaleDateString()}
            sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}
          />
        </Box>

        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {article.content}
        </Typography>
      </Box>
    </Container>
  );
};

export default NewsDetail;
