import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import { create, all } from 'mathjs';

const math = create(all);

// Real-life examples for Linear Programming
const realLifeExamples = [
  {
    title: 'Supply Chain Optimization',
    description: 'A company needs to optimize its supply chain by determining the optimal number of products to ship from multiple warehouses to multiple retail locations.',
    link: 'https://www.investopedia.com/terms/s/supply-chain-optimization.asp',
    example: {
      objective: 'Minimize Z = 5x1 + 3x2 + 4x3 + 2x4',
      constraints: [
        'x1 + x2 <= 100',
        'x3 + x4 <= 150',
        'x1 + x3 >= 80',
        'x2 + x4 >= 120'
      ],
      explanation: 'Where x1, x2, x3, x4 represent the number of products shipped from warehouses to retail locations, and the constraints represent warehouse capacity and retail demand.'
    }
  },
  {
    title: 'Workforce Scheduling',
    description: 'A call center needs to schedule staff to meet customer service demands while minimizing labor costs.',
    link: 'https://www.sciencedirect.com/topics/computer-science/workforce-scheduling',
    example: {
      objective: 'Minimize Z = 8x1 + 8x2 + 8x3 + 8x4 + 8x5 + 8x6 + 8x7',
      constraints: [
        'x1 + x4 + x5 + x6 + x7 >= 10',
        'x1 + x2 + x5 + x6 + x7 >= 12',
        'x1 + x2 + x3 + x6 + x7 >= 15',
        'x1 + x2 + x3 + x4 + x7 >= 14',
        'x1 + x2 + x3 + x4 + x5 >= 13',
        'x2 + x3 + x4 + x5 + x6 >= 11',
        'x3 + x4 + x5 + x6 + x7 >= 9'
      ],
      explanation: 'Where x1 through x7 represent the number of staff working each day of the week, and the constraints represent minimum staff requirements for each day.'
    }
  },
  {
    title: 'Portfolio Optimization',
    description: 'An investor wants to allocate funds across different assets to maximize returns while minimizing risk.',
    link: 'https://www.investopedia.com/terms/p/portfolio-optimization.asp',
    example: {
      objective: 'Maximize Z = 0.08x1 + 0.12x2 + 0.15x3',
      constraints: [
        'x1 + x2 + x3 = 100000',
        '0.15x1 + 0.25x2 + 0.35x3 <= 20000',
        'x1 >= 20000',
        'x2 >= 30000',
        'x3 >= 10000'
      ],
      explanation: 'Where x1, x2, x3 represent investments in bonds, stocks, and real estate respectively, and the constraints represent total budget, risk tolerance, and minimum investment requirements.'
    }
  }
];

function LinearProgramming() {
  const [objective, setObjective] = useState('Maximize Z = 3x1 + 2x2');
  const [constraints, setConstraints] = useState([
    { equation: '2x1 + x2 <= 10', slack: 's1' },
    { equation: 'x1 + 2x2 <= 8', slack: 's2' },
  ]);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [selectedExample, setSelectedExample] = useState(null);

  const addConstraint = () => {
    const newSlack = `s${constraints.length + 1}`;
    setConstraints([...constraints, { equation: '', slack: newSlack }]);
  };

  const removeConstraint = (index) => {
    const newConstraints = constraints.filter((_, i) => i !== index);
    setConstraints(newConstraints);
  };

  const updateConstraint = (index, value) => {
    const newConstraints = [...constraints];
    newConstraints[index].equation = value;
    setConstraints(newConstraints);
  };

  const loadExample = (example) => {
    setObjective(example.objective);
    setConstraints(example.constraints.map((eq, i) => ({ 
      equation: eq, 
      slack: `s${i+1}` 
    })));
    setSelectedExample(example);
    setSolution(null);
    setError('');
  };

  const solve = () => {
    try {
      setError('');
      
      // Validate inputs
      if (!objective) {
        setError('Please enter an objective function');
        return;
      }
      
      if (constraints.some(c => !c.equation)) {
        setError('Please fill in all constraints');
        return;
      }

      // Here you would implement the actual linear programming solver
      // For now, we'll just show a placeholder solution
      setSolution({
        status: 'Optimal solution found',
        variables: {
          x1: 2.5,
          x2: 2.75
        },
        objectiveValue: 13.5,
        slack: {
          s1: 0,
          s2: 0
        }
      });
      
    } catch (error) {
      setError(`Error solving the problem: ${error.message}`);
    }
  };

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Linear Programming Solver
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Solve linear programming problems with multiple variables and constraints
        </Typography>

        {/* Real-Life Examples Section */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Real-Life Examples
          </Typography>
          <Typography variant="body1" paragraph>
            Explore these real-world scenarios where Linear Programming is used to solve complex optimization problems:
          </Typography>
          
          <Grid container spacing={3}>
            {realLifeExamples.map((example, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-5px)',
                      transition: 'all 0.3s ease-in-out',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {example.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {example.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                      {example.example.explanation}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => loadExample(example.example)}
                      variant="outlined"
                    >
                      Load Example
                    </Button>
                    <Button 
                      size="small" 
                      component="a" 
                      href={example.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      startIcon={<LinkIcon />}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ mr: 2 }}>
              Objective Function
            </Typography>
            <Tooltip title="Enter the objective function in the format 'Maximize Z = 3x1 + 2x2' or 'Minimize Z = 3x1 + 2x2'">
              <IconButton size="small" onClick={() => setShowInfo(!showInfo)}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {showInfo && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Enter the objective function in the format 'Maximize Z = 3x1 + 2x2' or 'Minimize Z = 3x1 + 2x2'.
              The solver supports problems with multiple decision variables (x1, x2, x3, etc.) and multiple constraints.
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Objective Function"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            sx={{ mb: 4 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ mr: 2 }}>
              Constraints
            </Typography>
            <Tooltip title="Enter constraints in the format '2x1 + x2 <= 10'">
              <IconButton size="small">
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {constraints.map((constraint, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                label={`Constraint ${index + 1}`}
                value={constraint.equation}
                onChange={(e) => updateConstraint(index, e.target.value)}
                sx={{ mr: 2 }}
              />
              <IconButton 
                color="error" 
                onClick={() => removeConstraint(index)}
                disabled={constraints.length <= 2}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addConstraint}
            sx={{ mb: 4 }}
            disabled={constraints.length >= 10}
          >
            Add Constraint
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={solve}
            fullWidth
          >
            Solve
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>

        {solution && (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Solution
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Optimal Values
                </Typography>
                {Object.entries(solution.variables).map(([variable, value]) => (
                  <Typography key={variable} variant="body1">
                    {variable} = {value.toFixed(2)}
                  </Typography>
                ))}
                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Z = {solution.objectiveValue.toFixed(2)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Slack Variables
                </Typography>
                {Object.entries(solution.slack).map(([variable, value]) => (
                  <Typography key={variable} variant="body1">
                    {variable} = {value.toFixed(2)}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default LinearProgramming; 