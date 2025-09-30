import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Container,
  Fade,
  Grow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ComputerIcon from '@mui/icons-material/Computer';

const StyledCard = styled(Card)({
  height: '100%',
  borderRadius: 16,
  padding: '2rem',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(100, 108, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
});

const FeaturesSection = styled(Box)({
  padding: '5rem 2rem',
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
});

const FeatureIcon = styled(Box)({
  width: 60,
  height: 60,
  background: 'linear-gradient(135deg, #646cff, #535bf2)',
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem',
  color: 'white',
});

const features = [
  {
    icon: <SchoolIcon fontSize="large" />,
    title: 'Quantum Computing Workshops',
    description: 'Join our interactive workshops and learn about quantum computing from industry experts. Get hands-on experience with real quantum systems and simulators.'
  },
  {
    icon: <LiveTvIcon fontSize="large" />,
    title: 'Live Sessions',
    description: 'Participate in live online sessions with real-time interaction and Q&A. Connect with peers and instructors from around the world in our virtual classroom.'
  },
  {
    icon: <ComputerIcon fontSize="large" />,
    title: 'Hands-on Projects',
    description: 'Get practical experience with real quantum computing projects and simulations. Build quantum algorithms and run them on actual quantum hardware.'
  }
];

const Features = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    // Set up intersection observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleItems(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    // Observe elements with fade-in animation
    const elements = document.querySelectorAll('[data-fade-in]');
    elements.forEach(el => observer.observe(el));

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <FeaturesSection id="features">
      <Container maxWidth="lg">
        <Fade in={visibleItems.has('features-title')} timeout={1000}>
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom
            id="features-title"
            data-fade-in
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: '#1a202c',
              mb: 4
            }}
          >
            Features
          </Typography>
        </Fade>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Grow 
                in={visibleItems.has(`feature-${index}`)} 
                timeout={1000 + index * 200}
              >
                <div>
                  <StyledCard 
                    id={`feature-${index}`}
                    data-fade-in
                  >
                    <CardContent sx={{ padding: 0 }}>
                      <FeatureIcon>
                        {feature.icon}
                      </FeatureIcon>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        gutterBottom
                        sx={{ color: '#1a202c', fontWeight: 600 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ color: '#4a5568', lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </div>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>
    </FeaturesSection>
  );
};

export default Features;