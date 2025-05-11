import React, { useState, useEffect, useRef } from 'react';
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

// Real-life examples for the Graphical Method
const realLifeExamples = [
  {
    title: 'Resource Allocation',
    description: 'A small business needs to allocate limited resources between two products to maximize profit, considering constraints on materials and labor.',
    link: 'https://www.investopedia.com/terms/r/resource-allocation.asp',
    example: {
      objective: 'Maximize Z = 3x + 2y',
      constraints: [
        '2x + y <= 10',
        'x + 2y <= 8'
      ],
      explanation: 'Where x = units of Product A, y = units of Product B, and the constraints represent available materials and labor hours respectively.'
    }
  },
  {
    title: 'Diet Planning',
    description: 'A nutritionist needs to create a diet plan that meets nutritional requirements while minimizing cost, considering different food items.',
    link: 'https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/diet-optimization',
    example: {
      objective: 'Minimize Z = 2x + 3y',
      constraints: [
        '10x + 5y >= 50',
        '2x + 8y >= 20',
        'x + y <= 15'
      ],
      explanation: 'Where x = servings of food A, y = servings of food B, and the constraints represent minimum protein, minimum vitamins, and maximum servings respectively.'
    }
  },
  {
    title: 'Production Planning',
    description: 'A furniture manufacturer needs to decide how many tables and chairs to produce to maximize profit while considering limited resources.',
    link: 'https://www.investopedia.com/terms/p/production-possibility-frontier-ppf.asp',
    example: {
      objective: 'Maximize Z = 40x + 30y',
      constraints: [
        '2x + y <= 100',
        'x + 2y <= 80',
        'x + y <= 50'
      ],
      explanation: 'Where x = number of tables, y = number of chairs, and the constraints represent available wood (in board feet), labor hours, and machine hours respectively.'
    }
  }
];

function GraphicalMethod() {
  const canvasRef = useRef(null);
  const [objective, setObjective] = useState('Maximize Z = 3x + 2y');
  const [constraints, setConstraints] = useState([
    { equation: '2x + y <= 10', slack: 's1' },
    { equation: 'x + 2y <= 8', slack: 's2' },
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

  const parseObjective = (obj) => {
    // Extract objective function type (Maximize/Minimize)
    const isMaximize = obj.toLowerCase().includes('maximize');
    
    // Extract the function part
    const functionPart = obj.split('=')[1].trim();
    
    // Parse coefficients
    const terms = functionPart.split('+').map(term => term.trim());
    const coefficients = {
      x: 0,
      y: 0,
    };

    terms.forEach(term => {
      if (term.includes('x')) {
        coefficients.x = term === 'x' ? 1 : parseFloat(term);
      } else if (term.includes('y')) {
        coefficients.y = term === 'y' ? 1 : parseFloat(term);
      }
    });

    return {
      isMaximize,
      coefficients,
    };
  };

  const parseConstraint = (constraint) => {
    // Convert equation to standard form
    const parts = constraint.equation.split('<=').map(part => part.trim());
    const leftSide = parts[0];
    const rightSide = parts[1] || '0';
    
    // Convert to standard form: ax + by + s = c
    const terms = leftSide.split('+').map(term => term.trim());
    const coefficients = {
      x: 0,
      y: 0,
      slack: 1, // Coefficient for slack variable
      constant: parseFloat(rightSide)
    };

    terms.forEach(term => {
      if (term.includes('x')) {
        coefficients.x = term === 'x' ? 1 : parseFloat(term);
      } else if (term.includes('y')) {
        coefficients.y = term === 'y' ? 1 : parseFloat(term);
      }
    });

    return coefficients;
  };

  const findIntersection = (line1, line2) => {
    // Line 1: a1x + b1y = c1
    // Line 2: a2x + b2y = c2
    const { x: a1, y: b1, constant: c1 } = line1;
    const { x: a2, y: b2, constant: c2 } = line2;

    // Using Cramer's rule to solve the system
    const det = a1 * b2 - a2 * b1;
    
    if (Math.abs(det) < 0.0001) {
      return null; // Lines are parallel or coincident
    }
    
    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;
    
    return { x, y };
  };

  const isPointFeasible = (point, constraints) => {
    for (const constraint of constraints) {
      const { x, y, constant } = parseConstraint(constraint);
      const value = x * point.x + y * point.y;
      
      if (value > constant + 0.0001) {
        return false;
      }
    }
    
    return true;
  };

  const findOptimalSolution = (vertices, objective) => {
    const { isMaximize, coefficients } = parseObjective(objective);
    let optimalVertex = null;
    let optimalValue = isMaximize ? -Infinity : Infinity;
    
    for (const vertex of vertices) {
      const value = coefficients.x * vertex.x + coefficients.y * vertex.y;
      
      if (isMaximize && value > optimalValue) {
        optimalValue = value;
        optimalVertex = vertex;
      } else if (!isMaximize && value < optimalValue) {
        optimalValue = value;
        optimalVertex = vertex;
      }
    }
    
    return {
      vertex: optimalVertex,
      value: optimalValue
    };
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
      
      // Parse constraints
      const parsedConstraints = constraints.map(parseConstraint);
      
      // Find intersections between all pairs of constraints
      const intersections = [];
      
      for (let i = 0; i < parsedConstraints.length; i++) {
        for (let j = i + 1; j < parsedConstraints.length; j++) {
          const intersection = findIntersection(parsedConstraints[i], parsedConstraints[j]);
          
          if (intersection && 
              intersection.x >= 0 && 
              intersection.y >= 0 && 
              isPointFeasible(intersection, constraints)) {
            intersections.push(intersection);
          }
        }
      }
      
      // Add origin if feasible
      const origin = { x: 0, y: 0 };
      if (isPointFeasible(origin, constraints)) {
        intersections.push(origin);
      }
      
      // Add x and y intercepts if feasible
      for (const constraint of parsedConstraints) {
        const xIntercept = { x: constraint.constant / constraint.x, y: 0 };
        const yIntercept = { x: 0, y: constraint.constant / constraint.y };
        
        if (xIntercept.x >= 0 && isPointFeasible(xIntercept, constraints)) {
          intersections.push(xIntercept);
        }
        
        if (yIntercept.y >= 0 && isPointFeasible(yIntercept, constraints)) {
          intersections.push(yIntercept);
        }
      }
      
      // Remove duplicate points
      const uniqueIntersections = [];
      for (const point of intersections) {
        const isDuplicate = uniqueIntersections.some(p => 
          Math.abs(p.x - point.x) < 0.0001 && Math.abs(p.y - point.y) < 0.0001
        );
        
        if (!isDuplicate) {
          uniqueIntersections.push(point);
        }
      }
      
      // Find optimal solution
      const optimal = findOptimalSolution(uniqueIntersections, objective);
      
      setSolution({
        vertices: uniqueIntersections,
        optimal: optimal
      });
      
    } catch (error) {
      setError(`Error solving the problem: ${error.message}`);
    }
  };

  const drawGraph = () => {
    if (!solution) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const scale = 20; // pixels per unit
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw axis labels
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - padding + 20, height - padding + 20);
    ctx.fillText('y', padding - 20, padding + 20);
    
    // Draw grid lines
    ctx.beginPath();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
      // Vertical lines
      ctx.moveTo(padding + i * scale, padding);
      ctx.lineTo(padding + i * scale, height - padding);
      
      // Horizontal lines
      ctx.moveTo(padding, height - padding - i * scale);
      ctx.lineTo(width - padding, height - padding - i * scale);
    }
    ctx.stroke();
    
    // Draw tick marks and labels
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    
    for (let i = 0; i <= 10; i++) {
      // X-axis ticks and labels
      ctx.fillText(i.toString(), padding + i * scale, height - padding + 20);
      
      // Y-axis ticks and labels
      ctx.fillText(i.toString(), padding - 20, height - padding - i * scale);
    }
    
    // Draw feasible region
    ctx.beginPath();
    ctx.moveTo(padding + solution.vertices[0].x * scale, height - padding - solution.vertices[0].y * scale);
    
    for (let i = 1; i < solution.vertices.length; i++) {
      ctx.lineTo(padding + solution.vertices[i].x * scale, height - padding - solution.vertices[i].y * scale);
    }
    
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 128, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw vertices
    for (const vertex of solution.vertices) {
      ctx.beginPath();
      ctx.arc(
        padding + vertex.x * scale,
        height - padding - vertex.y * scale,
        5,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = 'blue';
      ctx.fill();
    }
    
    // Draw optimal solution
    if (solution.optimal.vertex) {
      ctx.beginPath();
      ctx.arc(
        padding + solution.optimal.vertex.x * scale,
        height - padding - solution.optimal.vertex.y * scale,
        7,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = 'red';
      ctx.fill();
      
      // Draw objective function line
      const { coefficients } = parseObjective(objective);
      const slope = -coefficients.x / coefficients.y;
      const intercept = solution.optimal.value / coefficients.y;
      
      ctx.beginPath();
      ctx.moveTo(padding, height - padding - intercept * scale);
      ctx.lineTo(width - padding, height - padding - (intercept + slope * (width - 2 * padding) / scale) * scale);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  useEffect(() => {
    if (solution) {
      drawGraph();
    }
  }, [solution]);

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
          Graphical Method Solver
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Solve linear programming problems using the Graphical Method
        </Typography>

        {/* Real-Life Examples Section */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Real-Life Examples
          </Typography>
          <Typography variant="body1" paragraph>
            Explore these real-world scenarios where the Graphical Method is used to solve practical business problems:
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
            <Tooltip title="Enter the objective function in the format 'Maximize Z = 3x + 2y' or 'Minimize Z = 3x + 2y'">
              <IconButton size="small" onClick={() => setShowInfo(!showInfo)}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {showInfo && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Enter the objective function in the format 'Maximize Z = 3x + 2y' or 'Minimize Z = 3x + 2y'.
              The solver currently supports problems with two decision variables (x, y) and up to 5 constraints.
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
            <Tooltip title="Enter constraints in the format '2x + y <= 10'">
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
            disabled={constraints.length >= 5}
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
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Solution
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Optimal Solution
                </Typography>
                <Typography variant="body1">
                  x = {solution.optimal.vertex.x.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  y = {solution.optimal.vertex.y.toFixed(2)}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Z = {solution.optimal.value.toFixed(2)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Feasible Region Vertices
                </Typography>
                {solution.vertices.map((vertex, index) => (
                  <Typography key={index} variant="body1">
                    Vertex {index + 1}: ({vertex.x.toFixed(2)}, {vertex.y.toFixed(2)})
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Paper>
        )}

        {solution && (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Graphical Representation
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <canvas
                ref={canvasRef}
                width={600}
                height={500}
                style={{ border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                The blue region represents the feasible area. The red dot indicates the optimal solution.
                The red dashed line represents the objective function at the optimal value.
              </Typography>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default GraphicalMethod; 