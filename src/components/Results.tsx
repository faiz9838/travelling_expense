import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CalculationResult, formatCurrency } from '../utils/calculations';

interface ResultsProps {
  result: CalculationResult;
  tripName?: string;
}

export default function Results({ result, tripName }: ResultsProps) {
  const categories = [
    { name: 'Transport', value: result.transportCost, color: '#2196f3' },
    { name: 'Accommodation', value: result.accommodationCost, color: '#4caf50' },
    { name: 'Food & Drinks', value: result.foodCost, color: '#ff9800' },
    { name: 'Local Transport', value: result.localTransportCost, color: '#9c27b0' },
    { name: 'Sightseeing', value: result.sightseeingCost, color: '#f44336' },
    { name: 'Miscellaneous', value: result.miscCost, color: '#607d8b' },
    { name: 'Operational', value: result.operationalCost, color: '#795548' },
  ].filter((cat) => cat.value > 0);

  const highestCategory = categories.reduce(
    (max, cat) => (cat.value > max.value ? cat : max),
    categories[0] || { name: '', value: 0 }
  );

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      {tripName && (
        <Typography variant="h5" gutterBottom color="primary">
          {tripName}
        </Typography>
      )}

      <Typography variant="h4" gutterBottom>
        Trip Summary
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Trip Cost
              </Typography>
              <Typography variant="h3">{formatCurrency(result.totalCost)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cost Per Person
              </Typography>
              <Typography variant="h3">{formatCurrency(result.costPerPerson)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {result.transportDetails && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Fuel Details:</strong> {result.transportDetails.fuelLitres} litres required •
            Fuel cost: {formatCurrency(result.transportDetails.fuelCost)}
          </Typography>
        </Alert>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Cost Breakdown
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.name}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {category.name}
                </Typography>
                <Typography variant="h6">{formatCurrency(category.value)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {((category.value / result.totalCost) * 100).toFixed(1)}% of total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {categories.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Visual Breakdown
          </Typography>
          <Box sx={{ width: '100%', height: 400, mt: 2 }}>
            <ResponsiveContainer>
              <BarChart data={categories} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ fontSize: '14px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="value" name="Cost" radius={[8, 8, 0, 0]}>
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Highest Expense:</strong> {highestCategory.name} accounts for{' '}
              {formatCurrency(highestCategory.value)} (
              {((highestCategory.value / result.totalCost) * 100).toFixed(1)}% of total)
            </Typography>
          </Alert>
        </>
      )}
    </Paper>
  );
}
