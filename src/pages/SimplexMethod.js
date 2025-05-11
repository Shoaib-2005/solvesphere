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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Divider,
  Card,
  CardContent,
  CardActions,
  Link,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import { create, all } from 'mathjs';

const math = create(all);

// Real-life examples for the Simplex Method
const realLifeExamples = [
  {
    title: 'Production Planning',
    description: 'A furniture manufacturer needs to decide how many tables and chairs to produce to maximize profit while considering limited resources of wood, labor, and machine time.',
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
  },
  {
    title: 'Diet Planning',
    description: 'A nutritionist needs to create a diet plan that meets nutritional requirements while minimizing cost, considering different food items with varying nutrient contents and prices.',
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
    title: 'Investment Portfolio',
    description: 'An investor wants to allocate funds between stocks and bonds to maximize expected return while keeping risk below a certain threshold.',
    link: 'https://www.investopedia.com/terms/p/portfolio-optimization.asp',
    example: {
      objective: 'Maximize Z = 0.08x + 0.05y',
      constraints: [
        'x + y <= 100000',
        '0.15x + 0.05y <= 10000',
        'x >= 20000'
      ],
      explanation: 'Where x = amount invested in stocks, y = amount invested in bonds, and the constraints represent total budget, maximum risk tolerance, and minimum stock investment respectively.'
    }
  }
];

function SimplexMethod() {
  const [objective, setObjective] = useState('Maximize Z = 3x + 2y');
  const [constraints, setConstraints] = useState([
    { equation: '2x + y <= 10', slack: 's1' },
    { equation: 'x + 2y <= 8', slack: 's2' },
  ]);
  const [solution, setSolution] = useState(null);
  const [steps, setSteps] = useState([]);
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
    setSteps([]);
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

  const createInitialTableau = () => {
    const obj = parseObjective(objective);
    const objCoeffs = obj.coefficients;
    
    // Create tableau structure
    const tableau = {
      variables: ['x', 'y', ...constraints.map(c => c.slack), 'RHS'],
      rows: [],
      objectiveRow: [],
    };

    // Add constraint rows
    constraints.forEach((constraint, index) => {
      const coeffs = parseConstraint(constraint);
      const row = {
        basic: constraint.slack,
        coefficients: [
          coeffs.x,
          coeffs.y,
          ...Array(constraints.length).fill(0).map((_, i) => i === index ? 1 : 0),
          coeffs.constant
        ]
      };
      tableau.rows.push(row);
    });

    // Add objective row
    tableau.objectiveRow = [
      -objCoeffs.x,
      -objCoeffs.y,
      ...Array(constraints.length).fill(0),
      0
    ];

    return tableau;
  };

  const findPivotColumn = (tableau) => {
    // For maximization, find the most negative value in the objective row
    const objRow = tableau.objectiveRow;
    let minValue = 0;
    let pivotCol = -1;

    for (let i = 0; i < objRow.length - 1; i++) {
      if (objRow[i] < minValue) {
        minValue = objRow[i];
        pivotCol = i;
      }
    }

    return pivotCol;
  };

  const findPivotRow = (tableau, pivotCol) => {
    // Find the row with the smallest positive ratio of RHS to pivot column coefficient
    let minRatio = Infinity;
    let pivotRow = -1;

    for (let i = 0; i < tableau.rows.length; i++) {
      const coeff = tableau.rows[i].coefficients[pivotCol];
      const rhs = tableau.rows[i].coefficients[tableau.rows[i].coefficients.length - 1];
      
      if (coeff > 0) {
        const ratio = rhs / coeff;
        if (ratio < minRatio) {
          minRatio = ratio;
          pivotRow = i;
        }
      }
    }

    return pivotRow;
  };

  const performPivot = (tableau, pivotRow, pivotCol) => {
    const newTableau = JSON.parse(JSON.stringify(tableau));
    const pivotValue = newTableau.rows[pivotRow].coefficients[pivotCol];
    
    // Update the basic variable for the pivot row
    newTableau.rows[pivotRow].basic = newTableau.variables[pivotCol];
    
    // Normalize the pivot row
    for (let i = 0; i < newTableau.rows[pivotRow].coefficients.length; i++) {
      newTableau.rows[pivotRow].coefficients[i] /= pivotValue;
    }
    
    // Update other rows
    for (let i = 0; i < newTableau.rows.length; i++) {
      if (i !== pivotRow) {
        const factor = newTableau.rows[i].coefficients[pivotCol];
        for (let j = 0; j < newTableau.rows[i].coefficients.length; j++) {
          newTableau.rows[i].coefficients[j] -= factor * newTableau.rows[pivotRow].coefficients[j];
        }
      }
    }
    
    // Update objective row
    const objFactor = newTableau.objectiveRow[pivotCol];
    for (let i = 0; i < newTableau.objectiveRow.length; i++) {
      newTableau.objectiveRow[i] -= objFactor * newTableau.rows[pivotRow].coefficients[i];
    }
    
    return newTableau;
  };

  const isOptimal = (tableau) => {
    // Check if all values in the objective row are non-negative
    return tableau.objectiveRow.every((value, index) => index === tableau.objectiveRow.length - 1 || value >= 0);
  };

  const extractSolution = (tableau) => {
    const solution = {
      x: 0,
      y: 0,
      z: tableau.objectiveRow[tableau.objectiveRow.length - 1],
      slack: {}
    };
    
    // Find values of basic variables
    tableau.rows.forEach(row => {
      const varIndex = tableau.variables.indexOf(row.basic);
      if (varIndex === 0) solution.x = row.coefficients[row.coefficients.length - 1];
      else if (varIndex === 1) solution.y = row.coefficients[row.coefficients.length - 1];
      else solution.slack[row.basic] = row.coefficients[row.coefficients.length - 1];
    });
    
    return solution;
  };

  const solve = () => {
    try {
      setError('');
      setSteps([]);
      
      // Validate inputs
      if (!objective) {
        setError('Please enter an objective function');
        return;
      }
      
      if (constraints.some(c => !c.equation)) {
        setError('Please fill in all constraints');
        return;
      }
      
      // Create initial tableau
      let tableau = createInitialTableau();
      let step = 1;
      
      // Add initial tableau to steps
      setSteps(prev => [...prev, { tableau: JSON.parse(JSON.stringify(tableau)), step }]);
      
      // Perform simplex iterations
      while (!isOptimal(tableau) && step < 10) {
        const pivotCol = findPivotColumn(tableau);
        
        if (pivotCol === -1) {
          setError('No entering variable found. The problem may be unbounded.');
          break;
        }
        
        const pivotRow = findPivotRow(tableau, pivotCol);
        
        if (pivotRow === -1) {
          setError('No leaving variable found. The problem may be infeasible.');
          break;
        }
        
        // Perform pivot operation
        tableau = performPivot(tableau, pivotRow, pivotCol);
        step++;
        
        // Add tableau to steps
        setSteps(prev => [...prev, { tableau: JSON.parse(JSON.stringify(tableau)), step }]);
      }
      
      // Extract solution
      const solution = extractSolution(tableau);
      setSolution(solution);
      
    } catch (error) {
      setError(`Error solving the problem: ${error.message}`);
    }
  };

  const renderTableau = (tableau, step) => {
    return (
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Basic</TableCell>
              {tableau.variables.map((variable, index) => (
                <TableCell key={index}>{variable}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableau.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell component="th" scope="row">
                  {row.basic}
                </TableCell>
                {row.coefficients.map((coeff, colIndex) => (
                  <TableCell key={colIndex}>{coeff.toFixed(2)}</TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow sx={{ fontWeight: 'bold' }}>
              <TableCell>Z</TableCell>
              {tableau.objectiveRow.map((coeff, index) => (
                <TableCell key={index}>{coeff.toFixed(2)}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Typography variant="caption">Step {step}</Typography>
        </Box>
      </TableContainer>
    );
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
          Simplex Method Solver
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Solve linear programming problems using the Simplex Method
        </Typography>

        {/* Real-Life Examples Section */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Real-Life Examples
          </Typography>
          <Typography variant="body1" paragraph>
            Explore these real-world scenarios where the Simplex Method is used to solve practical business problems:
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
              The solver currently supports maximization problems with two decision variables (x, y) and up to 5 constraints.
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
                  Optimal Values
                </Typography>
                <Typography variant="body1">
                  x = {solution.x.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  y = {solution.y.toFixed(2)}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Z = {solution.z.toFixed(2)}
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

        {steps.length > 0 && (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Solution Steps
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {steps.map((step, index) => (
              <Box key={index}>
                {renderTableau(step.tableau, step.step)}
              </Box>
            ))}
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default SimplexMethod; 