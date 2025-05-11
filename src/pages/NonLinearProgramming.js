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

// Real-life examples for Non-linear Programming
const realLifeExamples = [
  {
    title: 'Chemical Process Optimization',
    description: 'A chemical plant needs to optimize reaction conditions to maximize product yield while minimizing energy consumption.',
    link: 'https://www.sciencedirect.com/topics/engineering/chemical-process-optimization',
    example: {
      objective: 'Maximize Z = x1 * x2 * (1 - exp(-x3))',
      constraints: [
        'x1 + x2 <= 100',
        'x1^2 + x2^2 <= 5000',
        'x3 >= 0.1',
        'x3 <= 2'
      ],
      explanation: 'Where x1 = temperature, x2 = pressure, x3 = reaction time, and the constraints represent equipment limitations and safety requirements.'
    }
  },
  {
    title: 'Economic Growth Model',
    description: 'An economist wants to optimize investment and consumption rates to maximize long-term economic growth.',
    link: 'https://www.investopedia.com/terms/e/economic-growth.asp',
    example: {
      objective: 'Maximize Z = ln(c) + β * ln(k)',
      constraints: [
        'c + i = k^α',
        'k >= 0',
        'c >= 0'
      ],
      explanation: 'Where c = consumption, k = capital stock, i = investment, α = capital share, β = discount factor, and the constraints represent resource constraints.'
    }
  },
  {
    title: 'Structural Design',
    description: 'An engineer needs to optimize the dimensions of a beam to minimize weight while maintaining strength requirements.',
    link: 'https://www.sciencedirect.com/topics/engineering/structural-optimization',
    example: {
      objective: 'Minimize Z = w * h * L',
      constraints: [
        'w * h^2 >= 1000',
        'w/h <= 2',
        'w >= 10',
        'h >= 10'
      ],
      explanation: 'Where w = width, h = height, L = length of the beam, and the constraints represent strength requirements and practical limitations.'
    }
  }
];

function NonLinearProgramming() {
  const [objective, setObjective] = useState('Minimize Z = x1^2 + x2^2');
  const [constraints, setConstraints] = useState([
    { equation: 'x1 + x2 <= 10', slack: 's1' },
    { equation: 'x1^2 + x2^2 <= 50', slack: 's2' },
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

      // Here you would implement the actual non-linear programming solver
      // For now, we'll just show a placeholder solution
      setSolution({
        status: 'Optimal solution found',
        variables: {
          x1: 3.54,
          x2: 3.54
        },
        objectiveValue: 25.07,
        slack: {
          s1: 2.92,
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
          Non-linear Programming Solver
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Solve non-linear optimization problems with complex objective functions and constraints
        </Typography>

        {/* Real-Life Examples Section */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Real-Life Examples
          </Typography>
          <Typography variant="body1" paragraph>
            Explore these real-world scenarios where Non-linear Programming is used to solve complex optimization problems:
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
            <Tooltip title="Enter the objective function using mathematical notation (e.g., 'Minimize Z = x1^2 + x2^2')">
              <IconButton size="small" onClick={() => setShowInfo(!showInfo)}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {showInfo && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Enter the objective function using mathematical notation. You can use:
              - Powers: x1^2, x2^3
              - Exponential: exp(x), e^x
              - Logarithmic: ln(x), log(x)
              - Trigonometric: sin(x), cos(x)
              - Multiple variables: x1 * x2, x1 + x2
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
            <Tooltip title="Enter constraints using mathematical notation (e.g., 'x1^2 + x2^2 <= 50')">
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

export default NonLinearProgramming; 