import React from 'react';
import { Box, Container, Typography, Grid, Button, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import SupportIcon from '@mui/icons-material/Support';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const services = [
  {
    icon: <BarChartIcon sx={{ fontSize: 40 }} />,
    title: 'Operations Research',
    description: 'Optimize your business decisions with our advanced operations research solutions. We implement various methods like Linear Programming, Transportation Problems, and more.',
    link: '/graphical-method',
    isInternal: true,
    additionalLinks: [
      { name: 'Graphical Method', path: '/graphical-method' },
      { name: 'Simplex Method', path: '/simplex-method' },
      { name: 'Transportation Method', path: '/transportation-method' }
    ]
  },
  {
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
    title: 'Web Development',
    description: 'Create stunning, responsive websites with modern technologies. Our web development services ensure your online presence stands out.',
    link: 'https://www.w3schools.com/whatis/',
    isInternal: false
  },
  {
    icon: <StorageIcon sx={{ fontSize: 40 }} />,
    title: 'Database Management',
    description: 'Efficient database solutions for your business needs. We handle everything from design to maintenance.',
    link: 'https://www.oracle.com/database/what-is-database/',
    isInternal: false
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Cybersecurity',
    description: 'Protect your digital assets with our comprehensive security solutions. We offer advanced threat detection and prevention.',
    link: 'https://www.cisco.com/c/en/us/products/security/what-is-cybersecurity.html',
    isInternal: false
  },
  {
    icon: <CloudIcon sx={{ fontSize: 40 }} />,
    title: 'Cloud Solutions',
    description: 'Leverage the power of cloud computing for your business. We provide scalable and reliable cloud infrastructure.',
    link: 'https://aws.amazon.com/what-is-cloud-computing/',
    isInternal: false
  },
  {
    icon: <SupportIcon sx={{ fontSize: 40 }} />,
    title: 'Technical Support',
    description: '24/7 technical support to keep your systems running smoothly. Our expert team is always ready to help.',
    link: 'https://www.atlassian.com/itsm/service-request-management/technical-support',
    isInternal: false
  },
];

const caseStudies = [
  {
    title: 'Supply Chain Optimization',
    industry: 'Manufacturing',
    problem: 'A manufacturing company was struggling with inefficient distribution of products across multiple warehouses, leading to increased costs and delayed deliveries.',
    solution: 'We implemented a Transportation Problem solver to optimize the distribution network, reducing logistics costs by 23% and improving delivery times by 18%.',
    icon: <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
  },
  {
    title: 'Resource Allocation',
    industry: 'Healthcare',
    problem: 'A hospital needed to optimize staff scheduling across different departments while meeting various constraints and ensuring quality patient care.',
    solution: 'Using Linear Programming techniques, we developed a scheduling system that improved staff utilization by 15% while maintaining all required coverage ratios.',
    icon: <LightbulbIcon sx={{ fontSize: 40, color: 'primary.main' }} />
  },
  {
    title: 'Inventory Management',
    industry: 'Retail',
    problem: 'A retail chain was experiencing stockouts of popular items while overstocking slow-moving inventory, affecting profitability.',
    solution: 'We implemented an inventory optimization model that reduced stockouts by 42% and decreased holding costs by 27%, resulting in a 15% increase in profit margins.',
    icon: <StorageIcon sx={{ fontSize: 40, color: 'primary.main' }} />
  }
];

function Services() {
  const navigate = useNavigate();

  const handleLearnMore = (service) => {
    if (service.isInternal) {
      navigate(service.link);
    } else {
      window.open(service.link, '_blank');
    }
  };

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
            Explore our comprehensive range of services designed to help your business succeed
          </Typography>
        </Container>
      </Box>

      {/* Services Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                    alignItems: 'center',
                    textAlign: 'center',
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
                  <Typography color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                    {service.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleLearnMore(service)}
                    sx={{ mb: service.additionalLinks ? 2 : 0 }}
                  >
                    Learn More
                  </Button>
                  
                  {service.additionalLinks && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                      {service.additionalLinks.map((link, linkIndex) => (
                        <Button
                          key={linkIndex}
                          variant="text"
                          size="small"
                          onClick={() => navigate(link.path)}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          {link.name}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Paper>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Real-Life Problem Solutions Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            Real-Life Problem Solutions
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            See how our services have helped organizations solve complex business challenges
          </Typography>
          
          <Grid container spacing={4}>
            {caseStudies.map((study, index) => (
              <Grid item xs={12} md={4} key={index}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {study.icon}
                      <Typography variant="h5" component="h3" sx={{ ml: 2 }}>
                        {study.title}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
                      Industry: {study.industry}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Problem:
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      {study.problem}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Solution:
                    </Typography>
                    <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
                      {study.solution}
                    </Typography>
                  </Paper>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Services; 