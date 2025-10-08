import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  InputAdornment,
  Divider,
} from '@mui/material';
import { TripData } from '../utils/calculations';

interface TripFormProps {
  trip: TripData;
  onChange: (trip: TripData) => void;
  label?: string;
}

export default function TripForm({ trip, onChange, label }: TripFormProps) {
  const updateField = (field: keyof TripData, value: any) => {
    onChange({ ...trip, [field]: value });
  };

  const nights = Math.max(0, trip.days - 1);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      {label && (
        <Typography variant="h6" gutterBottom color="primary">
          {label}
        </Typography>
      )}

      <Typography variant="h6" gutterBottom>
        Trip Details
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Destination"
            value={trip.destination}
            onChange={(e) => updateField('destination', e.target.value)}
            required
            aria-label="Destination"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Number of Travellers"
            type="number"
            value={trip.travellers}
            onChange={(e) => {
              const value = e.target.value;
              updateField('travellers', value === '' ? '' : Math.max(1, parseInt(value) || 1));
            }}
            inputProps={{ min: 1, step: 1 }}
            required
            aria-label="Number of travellers"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Number of Days"
            type="number"
            value={trip.days}
            onChange={(e) => {
              const value = e.target.value;
              updateField('days', value === '' ? '' : Math.max(1, parseInt(value) || 1));
            }}
            inputProps={{ min: 1, step: 1 }}
            required
            aria-label="Number of days"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Trip Label (Optional)"
            value={trip.tripLabel || ''}
            onChange={(e) => updateField('tripLabel', e.target.value)}
            placeholder="e.g., Weekend Getaway"
            aria-label="Trip label"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Transport
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Transport Mode</InputLabel>
            <Select
              value={trip.transportMode}
              label="Transport Mode"
              onChange={(e) => updateField('transportMode', e.target.value)}
              aria-label="Transport mode"
            >
              <MenuItem value="train">Train</MenuItem>
              <MenuItem value="bus">Bus</MenuItem>
              <MenuItem value="flight">Flight</MenuItem>
              <MenuItem value="car">Car</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {trip.transportMode !== 'car' ? (
          <>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fare Per Person"
                type="number"
                value={trip.farePerPerson || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  updateField('farePerPerson', value === '' ? '' : parseFloat(value) || 0);
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                aria-label="Fare per person"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Food/Snacks Per Person"
                type="number"
                value={trip.foodOnTransportPerPerson || ''}
                onChange={(e) => updateField('foodOnTransportPerPerson', parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                helperText="On transport"
                aria-label="Food on transport per person"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Taxi to Station/Airport"
                type="number"
                value={trip.taxiToStation || ''}
                onChange={(e) => updateField('taxiToStation', parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                aria-label="Taxi to station"
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Distance"
                type="number"
                value={trip.totalDistance || ''}
                onChange={(e) => updateField('totalDistance', parseFloat(e.target.value) || 0)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">km</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 1 }}
                helperText="One-way distance"
                aria-label="Total distance in km"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={trip.isRoundTrip || false}
                    onChange={(e) => updateField('isRoundTrip', e.target.checked)}
                    aria-label="Round trip"
                  />
                }
                label="Round Trip"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Car Average"
                type="number"
                value={trip.carAverage || ''}
                onChange={(e) => updateField('carAverage', parseFloat(e.target.value) || 0)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">km/l</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.1 }}
                aria-label="Car fuel average"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fuel Price Per Litre"
                type="number"
                value={trip.fuelPricePerLitre || ''}
                onChange={(e) => updateField('fuelPricePerLitre', parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                aria-label="Fuel price per litre"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Toll & Parking"
                type="number"
                value={trip.tollParking || ''}
                onChange={(e) => updateField('tollParking', parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                aria-label="Toll and parking charges"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Refreshments / Snacks"
                type="number"
                value={trip.refreshments || ''}
                onChange={(e) => updateField('refreshments', parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                helperText="For journey"
                aria-label="Refreshments cost"
              />
            </Grid>
          </>
        )}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Accommodation
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Hotel Rate Per Night"
            type="number"
            value={trip.hotelRatePerNight}
            onChange={(e) => {
              const value = e.target.value;
              updateField('hotelRatePerNight', value === '' ? '' : parseFloat(value) || 0);

            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            required
            aria-label="Hotel rate per night"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Number of Rooms"
            type="number"
            value={trip.numberOfRooms}
            onChange={
              (e) => {
                const value = e.target.value;
                updateField('numberOfRooms', value === '' ? '' : Math.max(1, parseInt(value) || 1));
              }}
            inputProps={{ min: 1, step: 1 }}
            required
            aria-label="Number of rooms"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Nights"
            type="number"
            value={nights}
            disabled
            helperText="Auto-calculated from days"
            aria-label="Number of nights"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Daily Expenses
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Meals Per Day"
            type="number"
            value={trip.mealsPerDay}
            onChange={(e) => {
              const value = e.target.value;
              updateField('mealsPerDay', value === '' ? '' : Math.max(0, parseFloat(value) || 0));
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            aria-label="Meals per day"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={trip.mealsIsPerPerson}
                onChange={(e) => updateField('mealsIsPerPerson', e.target.checked)}
                aria-label="Meals cost is per person"
              />
            }
            label="Per Person"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Local Transport Per Day"
            type="number"
            value={trip.localTransportPerDay}
            onChange={(e) => {
              const value = e.target.value;
              updateField('localTransportPerDay', value === '' ? '' : Math.max(0, parseFloat(value) || 0));
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            aria-label="Local transport per day"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Sightseeing Per Day"
            type="number"
            value={trip.sightseeingPerDay}
            onChange={(e) => {
              const value = e.target.value;
              updateField('sightseeingPerDay', value === '' ? '' : Math.max(0, parseFloat(value) || 0));
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            aria-label="Sightseeing per day"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Miscellaneous Per Day"
            type="number"
            value={trip.miscPerDay}
            onChange={(e) => {
              const value = e.target.value;
              updateField('miscPerDay', value === '' ? '' : Math.max(0, parseFloat(value) || 0));
            }
            }
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            aria-label="Miscellaneous per day"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Other Operational Costs (Optional)
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Visa Fees"
            type="number"
            value={trip.visaFees || ''}
            onChange={(e) => {
              const value = e.target.value;
              updateField('visaFees', value === '' ? '' : parseFloat(value) || 0);
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            aria-label="Visa fees"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="SIM / Internet"
            type="number"
            value={trip.simInternet || ''}
            onChange={
              (e) => {
                const value = e.target.value;
                updateField('simInternet', value === '' ? '' : parseFloat(value) || 0);
              }}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            aria-label="SIM and internet costs"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Shopping"
            type="number"
            value={trip.shopping || ''}
            onChange={
              (e) => {
                const value = e.target.value;
                updateField('shopping', value === '' ? '' : parseFloat(value) || 0);
              }

            }
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            aria-label="Shopping budget"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Travel Insurance"
            type="number"
            value={trip.travelInsurance || ''}
            onChange={
              (e) => {
                const value = e.target.value;
                updateField('travelInsurance', value === '' ? '' : parseFloat(value) || 0);
              }}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            aria-label="Travel insurance cost"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Other Operational"
            type="number"
            value={trip.otherOperational || ''}
            onChange={(e) => {
              const value = e.target.value;
              updateField('otherOperational', value === '' ? '' : parseFloat(value) || 0);
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            aria-label="Other operational costs"
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
