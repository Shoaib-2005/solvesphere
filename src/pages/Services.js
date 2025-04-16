import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SupportIcon from '@mui/icons-material/Support';

const MotionBox = motion(Box);

const services = [
  {
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
    title: 'Custom Software Development',
    description:
      'Tailored software solutions designed to meet your specific business needs. From web applications to enterprise systems.',
    features: [
      'Web Application Development',
      'Mobile App Development',
      'Enterprise Software',
      'API Integration',
    ],
  },
  {
    icon: <StorageIcon sx={{ fontSize: 40 }} />,
    title: 'Database Solutions',
    description:
      'Robust database design and management services to ensure your data is secure, accessible, and optimized.',
    features: [
      'Database Design',
      'Data Migration',
      'Performance Optimization',
      'Backup & Recovery',
    ],
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Cybersecurity',
    description:
      'Comprehensive security solutions to protect your digital assets and ensure business continuity.',
    features: [
      'Security Audits',
      'Threat Detection',
      'Compliance Management',
      'Security Training',
    ],
  },
  {
    icon: <CloudIcon sx={{ fontSize: 40 }} />,
    title: 'Cloud Services',
    description:
      'Cloud infrastructure and services to scale your business efficiently and reduce operational costs.',
    features: [
      'Cloud Migration',
      'AWS/Azure/GCP',
      'Serverless Architecture',
      'Cloud Optimization',
    ],
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
    title: 'Data Analytics',
    description:
      'Transform your data into actionable insights with our advanced analytics solutions.',
    features: [
      'Business Intelligence',
      'Data Visualization',
      'Predictive Analytics',
      'Reporting Tools',
    ],
  },
  {
    icon: <SupportIcon sx={{ fontSize: 40 }} />,
    title: 'IT Support',
    description:
      '24/7 technical support and maintenance services to keep your systems running smoothly.',
    features: [
      'Help Desk Support',
      'System Maintenance',
      'Issue Resolution',
      'Performance Monitoring',
    ],
  },
];

function Services() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Our Services
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Comprehensive technology solutions to drive your business forward
          </Typography>
        </Container>
      </Box>

      {/* Services Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={6} key={index}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-5px)',
                      transition: 'all 0.3s ease-in-out',
                    },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{service.icon}</Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {service.description}
                  </Typography>
                  <Box sx={{ mt: 2, mb: 3 }}>
                    {service.features.map((feature, featureIndex) => (
                      <Typography
                        key={featureIndex}
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        • {feature}
                      </Typography>
                    ))}
                  </Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 'auto' }}
                  >
                    Learn More
                  </Button>
                </Paper>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', py: 8, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                Ready to Transform Your Business?
              </Typography>
              <Typography variant="body1" paragraph>
                Let's discuss how our services can help you achieve your business goals.
                Contact us today for a free consultation.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ px: 4 }}
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Services; 