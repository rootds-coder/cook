import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
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
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const ProjectProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '& .MuiLinearProgress-bar': {
    background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
  },
}));

const Projects: React.FC = () => {
  const projects = [
    {
      title: "Rural Education Initiative - UP",
      location: "Gorakhpur, Uttar Pradesh",
      date: "Ongoing",
      image: "/images/projects/education.jpg",
      description: `In Gorakhpur, we've partnered with local schools to provide quality education 
      to underprivileged children. Our recent success story includes setting up a digital 
      learning center that serves 200+ students daily.`,
      progress: 75,
      raised: "₹3,75,000",
      goal: "₹5,00,000",
      beneficiaries: 200,
      category: "Education"
    },
    {
      title: "Healthcare Access Program",
      location: "Rural Maharashtra",
      date: "March 2024",
      image: "/images/projects/healthcare.jpg",
      description: `Our mobile medical units have been providing essential healthcare services 
      to remote villages in Maharashtra. In the past month alone, we've conducted 15 medical 
      camps serving over 1,000 patients.`,
      progress: 60,
      raised: "₹3,00,000",
      goal: "₹5,00,000",
      beneficiaries: 1000,
      category: "Healthcare"
    },
    {
      title: "Women Empowerment Center",
      location: "Delhi NCR",
      date: "February 2024",
      image: "/images/projects/women-empowerment.jpg",
      description: `We've established a skill development center in Delhi NCR focusing on 
      digital literacy and entrepreneurship training for women. 50 women have already completed 
      their training and started small businesses.`,
      progress: 90,
      raised: "₹4,50,000",
      goal: "₹5,00,000",
      beneficiaries: 50,
      category: "Empowerment"
    }
  ];

  return (
    <Box>
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
                Our Active Projects
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}
              >
                Real stories of impact and transformation happening across India
              </Typography>
            </Box>
          </RevealOnScroll>

          {/* Projects Grid */}
          <Grid container spacing={4}>
            {projects.map((project, index) => (
              <RevealOnScroll key={index} direction="up" delay={index * 200}>
                <Grid item xs={12}>
                  <GlassCard>
                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <CardMedia
                          component="img"
                          height="100%"
                          image={project.image}
                          alt={project.title}
                          sx={{ 
                            minHeight: 300,
                            objectFit: 'cover'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{ mb: 2 }}>
                            <Chip 
                              label={project.category}
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
                            {project.title}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 3, 
                            mb: 2,
                            color: 'rgba(255,255,255,0.7)',
                            flexWrap: 'wrap'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocationOnIcon sx={{ fontSize: 20 }} />
                              <Typography variant="body2">{project.location}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarTodayIcon sx={{ fontSize: 20 }} />
                              <Typography variant="body2">{project.date}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PeopleIcon sx={{ fontSize: 20 }} />
                              <Typography variant="body2">{project.beneficiaries}+ beneficiaries</Typography>
                            </Box>
                          </Box>
                          <Typography 
                            sx={{ 
                              color: 'rgba(255,255,255,0.9)',
                              mb: 3
                            }}
                          >
                            {project.description}
                          </Typography>
                          <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Raised: {project.raised}
                              </Typography>
                              <Typography sx={{ color: '#2196F3' }}>
                                Goal: {project.goal}
                              </Typography>
                            </Box>
                            <ProjectProgress 
                              variant="determinate" 
                              value={project.progress} 
                            />
                          </Box>
                          <Button 
                            variant="contained" 
                            sx={{ 
                              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                              borderRadius: 2,
                              px: 4,
                              py: 1.5,
                              '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                              }
                            }}
                          >
                            Support This Project
                          </Button>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </GlassCard>
                </Grid>
              </RevealOnScroll>
            ))}
          </Grid>
        </Container>
      </PageWrapper>
    </Box>
  );
};

export default Projects;