import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

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
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const QuoteIcon = styled(FormatQuoteIcon)(({ theme }) => ({
  fontSize: 40,
  color: '#2196F3',
  opacity: 0.5,
}));

const SuccessStories: React.FC = () => {
  const stories = [
    {
      title: "Breaking the Cycle of Poverty Through Education",
      category: "Education",
      location: "Gorakhpur, UP",
      image: "/images/stories/education-story.jpg",
      beneficiary: "Priya Sharma",
      beneficiaryRole: "Student",
      avatar: "/images/avatars/priya.jpg",
      quote: `"The digital learning center has transformed my life. I can now attend online 
      classes and access educational resources I never had before. My dream of becoming a 
      software engineer feels achievable now."`,
      impact: [
        "Improved academic performance by 40%",
        "Secured scholarship for higher education",
        "Inspiring 50 other girls in the community"
      ],
      story: `Priya, a bright 16-year-old from a low-income family in Gorakhpur, faced numerous 
      obstacles in pursuing her education. The establishment of our digital learning center 
      provided her with access to quality educational resources and mentorship. Within a year, 
      her academic performance improved significantly, and she secured a prestigious scholarship. 
      Her success has inspired many other girls in her community to pursue their dreams.`
    },
    {
      title: "Healthcare Reaching the Unreached",
      category: "Healthcare",
      location: "Rural Maharashtra",
      image: "/images/stories/healthcare-story.jpg",
      beneficiary: "Ramesh Patil",
      beneficiaryRole: "Village Elder",
      avatar: "/images/avatars/ramesh.jpeg",
      quote: `"The mobile medical camps have been a blessing for our village. Many elderly 
      people who couldn't travel for treatment can now get regular check-ups and medicines 
      right here."`,
      impact: [
        "Served 1000+ patients in remote areas",
        "Reduced emergency cases by 60%",
        "15 successful medical camps conducted"
      ],
      story: `The remote village in Maharashtra had limited access to healthcare facilities, 
      with the nearest hospital being 50 kilometers away. Our mobile medical camps initiative 
      brought regular healthcare services to their doorstep. The impact was immediate - early 
      detection of health issues, regular monitoring of chronic conditions, and significant 
      reduction in emergency cases. The program has become a model for rural healthcare delivery.`
    },
    {
      title: "Empowering Women Through Digital Skills",
      category: "Empowerment",
      location: "Delhi NCR",
      image: "/images/stories/empowerment-story.jpg",
      beneficiary: "Meena Kumari",
      beneficiaryRole: "Entrepreneur",
      avatar: "/images/avatars/meena.jpg",
      quote: `"Learning digital skills opened new doors for me. I now run my own online 
      business and help other women in my community do the same. Financial independence 
      has given me confidence and respect."`,
      impact: [
        "50 women trained in digital skills",
        "30 successful online businesses started",
        "Average income increase of ₹15,000/month"
      ],
      story: `Meena, a homemaker with basic education, joined our women's empowerment program 
      to learn digital skills. Through intensive training in digital marketing, e-commerce, 
      and basic accounting, she started her own online handicraft business. Her success 
      inspired her to mentor other women, creating a ripple effect of empowerment in her 
      community. The program has helped create a network of financially independent women 
      entrepreneurs.`
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
            Stories of Impact
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            Real stories of lives transformed through your support
          </Typography>
        </Box>

        {/* Stories Grid */}
        <Grid container spacing={4}>
          {stories.map((story, index) => (
            <Grid item xs={12} key={index}>
              <GlassCard>
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <CardMedia
                      component="img"
                      height="100%"
                      image={story.image}
                      alt={story.title}
                      sx={{ 
                        minHeight: 400,
                        objectFit: 'cover'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={story.category}
                          sx={{ 
                            background: 'rgba(33, 150, 243, 0.2)',
                            color: '#2196F3',
                            mb: 2
                          }}
                        />
                      </Box>
                      <Typography 
                        variant="h4" 
                        gutterBottom
                        sx={{ color: '#2196F3' }}
                      >
                        {story.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.7)',
                          mb: 3
                        }}
                      >
                        {story.location}
                      </Typography>

                      {/* Quote Section */}
                      <Box sx={{ 
                        position: 'relative',
                        mb: 4,
                        p: 3,
                        background: 'rgba(33, 150, 243, 0.1)',
                        borderRadius: 2
                      }}>
                        <QuoteIcon sx={{ position: 'absolute', top: -20, left: -10 }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontStyle: 'italic',
                            color: 'rgba(255,255,255,0.9)'
                          }}
                        >
                          {story.quote}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          mt: 2
                        }}>
                          <Avatar
                            src={story.avatar}
                            sx={{ width: 40, height: 40, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="subtitle1">
                              {story.beneficiary}
                            </Typography>
                            <Typography 
                              variant="body2"
                              sx={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                              {story.beneficiaryRole}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Impact Points */}
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ color: '#2196F3' }}
                      >
                        Impact
                      </Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        {story.impact.map((point, idx) => (
                          <Typography 
                            component="li" 
                            key={idx}
                            sx={{ 
                              color: 'rgba(255,255,255,0.9)',
                              mb: 1
                            }}
                          >
                            {point}
                          </Typography>
                        ))}
                      </Box>

                      {/* Full Story */}
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          color: '#2196F3',
                          mt: 3
                        }}
                      >
                        The Story
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {story.story}
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageWrapper>
  );
};

export default SuccessStories; 