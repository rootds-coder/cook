import React from 'react';
import { Box, styled } from '@mui/material';

const SliderContainer = styled(Box)({
  width: '100%',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  padding: '30px 0',
  position: 'relative',
});

const SliderTrack = styled(Box)({
  display: 'flex',
  animation: 'scroll 40s linear infinite',
  '@keyframes scroll': {
    '0%': {
      transform: 'translateX(0)',
    },
    '100%': {
      transform: 'translateX(-50%)',
    },
  },
  '&:hover': {
    animationPlayState: 'paused',
  },
});

const BrandLogo = styled('img')({
  height: '50px',
  margin: '0 40px',
  opacity: 0.8,
  transition: 'all 0.3s ease',
  '&:hover': {
    opacity: 1,
    transform: 'scale(1.1)',
    filter: 'brightness(1.1)'
  },
});

const BrandSlider: React.FC = () => {
  // Double the items to create a seamless loop
  const brands = [
    { name: 'Microsoft', logo: '/images/brands/microsoft.jpg' },
    { name: 'Google', logo: '/images/brands/google.jpg' },
    { name: 'Apple', logo: '/images/brands/apple.jpg' },
    { name: 'Amazon', logo: '/images/brands/amazon.jpg' },
    { name: 'Tesla', logo: '/images/brands/tesla.jpg' },
    { name: 'Meta', logo: '/images/brands/meta.jpg' },
    { name: 'Netflix', logo: '/images/brands/netflix.jpg' },
    { name: 'IBM', logo: '/images/brands/ibm.jpg' },
  ];

  const doubledBrands = [...brands, ...brands]; // Double the array for seamless loop

  return (
    <SliderContainer>
      <SliderTrack>
        {doubledBrands.map((brand, index) => (
          <BrandLogo
            key={`${brand.name}-${index}`}
            src={brand.logo}
            alt={brand.name}
            loading="lazy"
          />
        ))}
      </SliderTrack>
    </SliderContainer>
  );
};

export default BrandSlider; 