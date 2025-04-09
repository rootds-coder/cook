import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupsIcon from '@mui/icons-material/Groups';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RevealOnScroll from '../../components/shared/RevealOnScroll';

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

const StoryCard = styled(GlassCard)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
  },
}));

const ValueIcon = styled(Box)(({ theme }) => ({
  background: 'rgba(33, 150, 243, 0.1)',
  borderRadius: '50%',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    color: '#2196F3',
  },
}));

const AboutUs: React.FC = () => {
  const recentStory = {
    title: "Hope for Tomorrow: The Story of Riya",
    date: "March 15, 2024",
    content: `In the heart of rural Uttar Pradesh, 12-year-old Riya dreamed of becoming a doctor. 
    Despite her exceptional academic performance, her family's financial struggles threatened to end 
    her education prematurely. That's when our foundation stepped in.

    Through our Education Support Initiative, we provided Riya with a comprehensive scholarship 
    covering her education expenses, books, and additional tutoring. Today, she continues to excel 
    in her studies, maintaining top positions in her class.

    But this isn't just about academic success. Riya's story represents hope for countless other 
    children in similar situations. Her determination, combined with the support from donors like 
    you, is creating a ripple effect in her community, inspiring other young girls to pursue their dreams.`,
    impact: "Thanks to supporters like you, we've helped 50+ students like Riya continue their education in the past year alone."
  };

  const ourValues = [
    {
      icon: <TimelineIcon />,
      title: "Transparency",
      description: "Every donation is tracked and reported with complete transparency, ensuring your contribution makes a real impact."
    },
    {
      icon: <GroupsIcon />,
      title: "Community First",
      description: "We believe in empowering communities to create sustainable, long-term positive change."
    },
    {
      icon: <VolunteerActivismIcon />,
      title: "Compassion",
      description: "Our work is driven by genuine care and understanding for those we serve."
    },
    {
      icon: <LightbulbIcon />,
      title: "Innovation",
      description: "We constantly seek innovative solutions to address complex social challenges."
    }
  ];

  return (
    <PageWrapper>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <RevealOnScroll>
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
              Our Journey of Impact
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '800px',
                margin: '0 auto'
              }}
            >
              Since 2023, we've been working tirelessly to create positive change in communities across India.
            </Typography>
          </Box>
        </RevealOnScroll>

        {/* Recent Impact Story */}
        <RevealOnScroll direction="up" delay={200}>
          <Box sx={{ mb: 8 }}>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: '#2196F3',
                mb: 4
              }}
            >
              Recent Impact Story
            </Typography>
            <StoryCard>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#2196F3' }}>
                  {recentStory.title}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    display: 'block',
                    mb: 2
                  }}
                >
                  {recentStory.date}
                </Typography>
                <Typography 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    whiteSpace: 'pre-line',
                    mb: 3
                  }}
                >
                  {recentStory.content}
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#2196F3',
                    fontStyle: 'italic'
                  }}
                >
                  {recentStory.impact}
                </Typography>
              </CardContent>
            </StoryCard>
          </Box>
        </RevealOnScroll>

        {/* Our Values */}
        <RevealOnScroll direction="up" delay={400}>
          <Box sx={{ mb: 8 }}>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: '#2196F3',
                mb: 4
              }}
            >
              Our Values
            </Typography>
            <Grid container spacing={4}>
              {ourValues.map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <GlassCard sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <ValueIcon>
                        {value.icon}
                      </ValueIcon>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ color: '#2196F3' }}
                      >
                        {value.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {value.description}
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </RevealOnScroll>

        {/* Team Section */}
        <RevealOnScroll direction="up" delay={600}>
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: '#2196F3',
                mb: 4
              }}
            >
              Our Team
            </Typography>
            <Grid container spacing={4}>
              {[
                {
                  name: "Kunal Singh Tanwar",
                  role: "Founder & CEO",
                  image: "/images/team/kunal.jpg"
                },
                {
                  name: "Kapil Kumar",
                  role: "Head of Operations",
                  image: "/images/team/kapil.jpg"
                },
                {
                  name: "Mintu Yadav",
                  role: "Community Manager",
                  image: "/images/team/mintu.jpg"
                }
              ].map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <GlassCard>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Avatar 
                        src={member.image}
                        sx={{ 
                          width: 120, 
                          height: 120, 
                          margin: '0 auto 16px',
                          border: '4px solid rgba(33, 150, 243, 0.3)'
                        }}
                      />
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ color: '#2196F3' }}
                      >
                        {member.name}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {member.role}
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </RevealOnScroll>
      </Container>
    </PageWrapper>
  );
};

export default AboutUs; 