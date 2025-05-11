import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';

function TransportationMethod() {
  const [sources, setSources] = useState(3);
  const [destinations, setDestinations] = useState(3);
  const [costs, setCosts] = useState(Array(3).fill().map(() => Array(3).fill('')));
  const [supply, setSupply] = useState(Array(3).fill(''));
  const [demand, setDemand] = useState(Array(3).fill(''));
  const [solution, setSolution] = useState(null);

  const handleCostChange = (i, j, value) => {
    const newCosts = costs.map(row => [...row]);
    newCosts[i][j] = value;
    setCosts(newCosts);
  };

  const handleSupplyChange = (index, value) => {
    const newSupply = [...supply];
    newSupply[index] = value;
    setSupply(newSupply);
  };

  const handleDemandChange = (index, value) => {
    const newDemand = [...demand];
    newDemand[index] = value;
    setDemand(newDemand);
  };

  const northWestCornerMethod = () => {
    const supplyTemp = supply.map(s => parseInt(s));
    const demandTemp = demand.map(d => parseInt(d));
    const allocation = Array(sources).fill().map(() => Array(destinations).fill(0));
    let totalCost = 0;

    let i = 0, j = 0;
    while (i < sources && j < destinations) {
      const quantity = Math.min(supplyTemp[i], demandTemp[j]);
      allocation[i][j] = quantity;
      totalCost += quantity * parseInt(costs[i][j]);
      
      supplyTemp[i] -= quantity;
      demandTemp[j] -= quantity;

      if (supplyTemp[i] === 0) i++;
      if (demandTemp[j] === 0) j++;
    }

    return { allocation, totalCost };
  };

  const solve = () => {
    // Validate inputs
    const totalSupply = supply.reduce((sum, s) => sum + parseInt(s || 0), 0);
    const totalDemand = demand.reduce((sum, d) => sum + parseInt(d || 0), 0);

    if (totalSupply !== totalDemand) {
      setSolution({
        error: `Supply (${totalSupply}) and demand (${totalDemand}) must be equal`
      });
      return;
    }

    if (supply.some(s => s === '') || demand.some(d => d === '') || 
        costs.some(row => row.some(cost => cost === ''))) {
      setSolution({
        error: 'All fields must be filled'
      });
      return;
    }

    const result = northWestCornerMethod();
    setSolution({
      allocation: result.allocation,
      totalCost: result.totalCost
    });
  };

  const resizeGrid = (newSources, newDestinations) => {
    const newCosts = Array(newSources).fill().map(() => Array(newDestinations).fill(''));
    const newSupply = Array(newSources).fill('');
    const newDemand = Array(newDestinations).fill('');

    // Preserve existing values
    for (let i = 0; i < Math.min(sources, newSources); i++) {
      for (let j = 0; j < Math.min(destinations, newDestinations); j++) {
        newCosts[i][j] = costs[i][j];
      }
      newSupply[i] = supply[i];
    }

    for (let j = 0; j < Math.min(destinations, newDestinations); j++) {
      newDemand[j] = demand[j];
    }

    setCosts(newCosts);
    setSupply(newSupply);
    setDemand(newDemand);
    setSources(newSources);
    setDestinations(newDestinations);
    setSolution(null);
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Transportation Method Solver
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Sources"
                    type="number"
                    value={sources}
                    onChange={(e) => resizeGrid(parseInt(e.target.value), destinations)}
                    inputProps={{ min: 1, max: 10 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Destinations"
                    type="number"
                    value={destinations}
                    onChange={(e) => resizeGrid(sources, parseInt(e.target.value))}
                    inputProps={{ min: 1, max: 10 }}
                  />
                </Grid>
              </Grid>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sources / Destinations</TableCell>
                      {Array(destinations).fill().map((_, j) => (
                        <TableCell key={j}>D{j + 1}</TableCell>
                      ))}
                      <TableCell>Supply</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array(sources).fill().map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>S{i + 1}</TableCell>
                        {Array(destinations).fill().map((_, j) => (
                          <TableCell key={j}>
                            <TextField
                              size="small"
                              value={costs[i][j]}
                              onChange={(e) => handleCostChange(i, j, e.target.value)}
                              type="number"
                              inputProps={{ min: 0 }}
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <TextField
                            size="small"
                            value={supply[i]}
                            onChange={(e) => handleSupplyChange(i, e.target.value)}
                            type="number"
                            inputProps={{ min: 0 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>Demand</TableCell>
                      {Array(destinations).fill().map((_, j) => (
                        <TableCell key={j}>
                          <TextField
                            size="small"
                            value={demand[j]}
                            onChange={(e) => handleDemandChange(j, e.target.value)}
                            type="number"
                            inputProps={{ min: 0 }}
                          />
                        </TableCell>
                      ))}
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                variant="contained"
                onClick={solve}
                sx={{ mt: 3 }}
              >
                Solve
              </Button>
            </Paper>
          </Grid>

          {solution && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>
                  Solution
                </Typography>
                
                {solution.error ? (
                  <Alert severity="error">{solution.error}</Alert>
                ) : (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Initial Solution using North-West Corner Method:
                    </Typography>
                    <TableContainer sx={{ mb: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Sources / Destinations</TableCell>
                            {Array(destinations).fill().map((_, j) => (
                              <TableCell key={j}>D{j + 1}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {solution.allocation.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>S{i + 1}</TableCell>
                              {row.map((value, j) => (
                                <TableCell key={j}>
                                  {value > 0 ? value : '-'}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Typography variant="h6">
                      Total Transportation Cost: {solution.totalCost}
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default TransportationMethod; 