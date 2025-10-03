import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Chip,
} from '@mui/material';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { CalculationResult, formatCurrency, TripData } from '../utils/calculations';

interface CompareTripsProps {
  trip1: TripData;
  trip2: TripData;
  result1: CalculationResult;
  result2: CalculationResult;
}

export default function CompareTrips({ trip1, trip2, result1, result2 }: CompareTripsProps) {
  const difference = Math.abs(result1.totalCost - result2.totalCost);
  const cheaper = result1.totalCost < result2.totalCost ? 'trip1' : result2.totalCost < result1.totalCost ? 'trip2' : 'equal';
  const percentageDifference =
    Math.max(result1.totalCost, result2.totalCost) > 0
      ? (difference / Math.max(result1.totalCost, result2.totalCost)) * 100
      : 0;

  const categories = [
    { name: 'Transport', value1: result1.transportCost, value2: result2.transportCost },
    { name: 'Accommodation', value1: result1.accommodationCost, value2: result2.accommodationCost },
    { name: 'Food & Drinks', value1: result1.foodCost, value2: result2.foodCost },
    { name: 'Local Transport', value1: result1.localTransportCost, value2: result2.localTransportCost },
    { name: 'Sightseeing', value1: result1.sightseeingCost, value2: result2.sightseeingCost },
    { name: 'Miscellaneous', value1: result1.miscCost, value2: result2.miscCost },
    { name: 'Operational', value1: result1.operationalCost, value2: result2.operationalCost },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Trip Comparison
      </Typography>

      {cheaper !== 'equal' && (
        <Alert
          severity="success"
          icon={<TrendingDown />}
          sx={{ mb: 3 }}
        >
          <Typography variant="body1">
            <strong>
              {cheaper === 'trip1' ? trip1.destination : trip2.destination}
            </strong>{' '}
            is cheaper by {formatCurrency(difference)} ({percentageDifference.toFixed(1)}%)
          </Typography>
        </Alert>
      )}

      {cheaper === 'equal' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">Both trips have the same total cost</Typography>
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: cheaper === 'trip1' ? 'success.light' : 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              {trip1.destination || 'Trip 1'}
              {cheaper === 'trip1' && (
                <Chip label="Cheaper" color="success" size="small" sx={{ ml: 1 }} />
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {trip1.travellers} traveller(s) • {trip1.days} day(s) • {trip1.transportMode}
            </Typography>
            <Typography variant="h4" color={cheaper === 'trip1' ? 'success.dark' : 'text.primary'}>
              {formatCurrency(result1.totalCost)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatCurrency(result1.costPerPerson)} per person
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: cheaper === 'trip2' ? 'success.light' : 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              {trip2.destination || 'Trip 2'}
              {cheaper === 'trip2' && (
                <Chip label="Cheaper" color="success" size="small" sx={{ ml: 1 }} />
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {trip2.travellers} traveller(s) • {trip2.days} day(s) • {trip2.transportMode}
            </Typography>
            <Typography variant="h4" color={cheaper === 'trip2' ? 'success.dark' : 'text.primary'}>
              {formatCurrency(result2.totalCost)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatCurrency(result2.costPerPerson)} per person
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Category-wise Comparison
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell align="right"><strong>{trip1.destination || 'Trip 1'}</strong></TableCell>
              <TableCell align="right"><strong>{trip2.destination || 'Trip 2'}</strong></TableCell>
              <TableCell align="right"><strong>Difference</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => {
              const diff = category.value1 - category.value2;
              const showRow = category.value1 > 0 || category.value2 > 0;

              if (!showRow) return null;

              return (
                <TableRow key={category.name}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell align="right">{formatCurrency(category.value1)}</TableCell>
                  <TableCell align="right">{formatCurrency(category.value2)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      {diff !== 0 && (
                        <>
                          {diff < 0 ? (
                            <TrendingDown size={16} color="green" />
                          ) : (
                            <TrendingUp size={16} color="red" />
                          )}
                          <Typography
                            variant="body2"
                            color={diff < 0 ? 'success.main' : 'error.main'}
                          >
                            {formatCurrency(Math.abs(diff))}
                          </Typography>
                        </>
                      )}
                      {diff === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Same
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell><strong>Total Cost</strong></TableCell>
              <TableCell align="right"><strong>{formatCurrency(result1.totalCost)}</strong></TableCell>
              <TableCell align="right"><strong>{formatCurrency(result2.totalCost)}</strong></TableCell>
              <TableCell align="right">
                <strong>{formatCurrency(difference)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
