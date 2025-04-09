import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

const GlassAccordion = styled(Accordion)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px !important',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  marginBottom: theme.spacing(2),
  '&:before': {
    display: 'none',
  },
  '& .MuiAccordionSummary-root': {
    borderRadius: 16,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: '#2196F3',
  },
}));

const CategoryIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: 'rgba(33, 150, 243, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 30,
    color: '#2196F3',
  },
}));

const FAQ: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const categories = [
    {
      title: "Donations",
      icon: <MonetizationOnIcon />,
      description: "Questions about making donations and payment methods"
    },
    {
      title: "Volunteering",
      icon: <VolunteerActivismIcon />,
      description: "Information about volunteering opportunities and requirements"
    },
    {
      title: "Legal & Compliance",
      icon: <AccountBalanceIcon />,
      description: "Details about our legal status and compliances"
    },
    {
      title: "Tax Benefits",
      icon: <ReceiptIcon />,
      description: "Information about tax deductions and receipts"
    }
  ];

  const faqs = [
    {
      category: "Donations",
      questions: [
        {
          question: "How can I make a donation?",
          answer: `You can make a donation through multiple channels:
          • UPI payment through our QR code
          • Direct bank transfer
          • Online payment through our website
          All transactions are secure and you'll receive an immediate confirmation.`
        },
        {
          question: "Is my donation tax-deductible?",
          answer: `Yes, all donations are eligible for tax deduction under Section 80G 
          of the Income Tax Act. You will receive a tax receipt within 24 hours of your donation.`
        },
        {
          question: "Can I make a recurring donation?",
          answer: `Yes, you can set up monthly or quarterly recurring donations through our 
          website. This helps us plan our projects better and ensures sustained support for 
          our beneficiaries.`
        }
      ]
    },
    {
      category: "Volunteering",
      questions: [
        {
          question: "What volunteering opportunities are available?",
          answer: `We offer various volunteering opportunities including:
          • Teaching and mentoring
          • Healthcare camps assistance
          • Community event organization
          • Digital skills training
          You can choose based on your skills and availability.`
        },
        {
          question: "What is the minimum time commitment required?",
          answer: `The minimum commitment varies by program:
          • Teaching: 4-6 hours/week
          • Healthcare camps: Weekend camps
          • Community events: Flexible hours
          We can work with your schedule to find the best fit.`
        }
      ]
    },
    {
      category: "Legal & Compliance",
      questions: [
        {
          question: "Is your organization registered?",
          answer: `Yes, we are a registered non-profit organization under Section 8 of the 
          Companies Act, 2013. We maintain full compliance with all legal and regulatory 
          requirements.`
        },
        {
          question: "How do you ensure transparency?",
          answer: `We maintain complete transparency through:
          • Annual financial audits
          • Regular impact reports
          • Project-wise fund utilization reports
          • Monthly newsletters to donors
          All our reports are available on our website.`
        }
      ]
    },
    {
      category: "Tax Benefits",
      questions: [
        {
          question: "How do I claim tax benefits for my donation?",
          answer: `After making a donation, you'll receive a tax receipt with our 80G 
          registration number. You can use this receipt while filing your income tax returns 
          to claim deduction under Section 80G.`
        },
        {
          question: "When will I receive my tax receipt?",
          answer: `Tax receipts are sent automatically within 24 hours of receiving your 
          donation. If you haven't received it, please check your spam folder or contact 
          our support team.`
        }
      ]
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
                Frequently Asked Questions
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}
              >
                Find answers to common questions about donations, volunteering, and more
              </Typography>
            </Box>
          </RevealOnScroll>

          {/* Categories */}
          <RevealOnScroll direction="up" delay={200}>
            <Grid container spacing={4} sx={{ mb: 8 }}>
              {categories.map((category, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <GlassCard sx={{ height: '100%' }}>
                    <CardContent sx={{ 
                      textAlign: 'center',
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <CategoryIcon>
                        {category.icon}
                      </CategoryIcon>
                      <Typography 
                        variant="h5" 
                        gutterBottom
                        sx={{ color: '#2196F3' }}
                      >
                        {category.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {category.description}
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </RevealOnScroll>

          {/* FAQs */}
          {faqs.map((category, index) => (
            <RevealOnScroll key={category.category} direction="up" delay={(index + 1) * 200}>
              <Box sx={{ mb: 6 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{ 
                    color: '#2196F3',
                    mb: 3
                  }}
                >
                  {category.category}
                </Typography>
                {category.questions.map((faq, index) => (
                  <GlassAccordion
                    key={index}
                    expanded={expanded === `${category.category}-${index}`}
                    onChange={handleChange(`${category.category}-${index}`)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <Typography variant="h6">
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </GlassAccordion>
                ))}
              </Box>
            </RevealOnScroll>
          ))}

          {/* Contact Section */}
          <RevealOnScroll direction="up" delay={800}>
            <GlassCard sx={{ mt: 8 }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  Still have questions?
                </Typography>
                <Typography 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    mb: 3
                  }}
                >
                  Our team is here to help you with any questions you might have
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                    }
                  }}
                >
                  Contact Us
                </Button>
              </CardContent>
            </GlassCard>
          </RevealOnScroll>
        </Container>
      </PageWrapper>
    </Box>
  );
};

export default FAQ;