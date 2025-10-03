import { useState, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Calculator, Plus, X } from 'lucide-react';
import TripForm from './components/TripForm';
import Results from './components/Results';
import CompareTrips from './components/CompareTrips';
import SaveShareExport from './components/SaveShareExport';
import { TripData, calculateTrip } from './utils/calculations';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const defaultTrip: TripData = {
  destination: '',
  travellers: 2,
  days: 3,
  transportMode: 'train',
  hotelRatePerNight: 0,
  numberOfRooms: 1,
  mealsPerDay: 0,
  mealsIsPerPerson: true,
  localTransportPerDay: 0,
  sightseeingPerDay: 0,
  miscPerDay: 0,
};

function App() {
  const [trip1, setTrip1] = useState<TripData>(defaultTrip);
  const [trip2, setTrip2] = useState<TripData>(defaultTrip);
  const [compareMode, setCompareMode] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const result1 = calculateTrip(trip1);
  const result2 = calculateTrip(trip2);

  const isValidTrip = (trip: TripData) => {
    return trip.destination.trim() !== '' && trip.travellers >= 1 && trip.days >= 1;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <Calculator size={28} style={{ marginRight: 12 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Trip Expense Calculator
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={compareMode}
                  onChange={(e) => setCompareMode(e.target.checked)}
                  color="default"
                  aria-label="Compare two trips"
                />
              }
              label="Compare Mode"
              sx={{ color: 'white' }}
            />
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'info.lighter', border: '1px solid', borderColor: 'info.light' }}>
            <Typography variant="body2" color="text.secondary">
              {compareMode
                ? 'Compare two trips side-by-side to find the best option for your journey.'
                : 'Calculate your trip expenses including transport, accommodation, food, and more.'}
            </Typography>
          </Paper>

          <Box ref={contentRef}>
            <Grid container spacing={3}>
              {compareMode ? (
                <>
                  <Grid item xs={12} lg={6}>
                    <TripForm trip={trip1} onChange={setTrip1} label="Trip 1" />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <TripForm trip={trip2} onChange={setTrip2} label="Trip 2" />
                  </Grid>

                  {isValidTrip(trip1) && (
                    <Grid item xs={12} lg={6}>
                      <Results result={result1} tripName={trip1.destination || 'Trip 1'} />
                    </Grid>
                  )}

                  {isValidTrip(trip2) && (
                    <Grid item xs={12} lg={6}>
                      <Results result={result2} tripName={trip2.destination || 'Trip 2'} />
                    </Grid>
                  )}

                  {isValidTrip(trip1) && isValidTrip(trip2) && (
                    <Grid item xs={12}>
                      <CompareTrips trip1={trip1} trip2={trip2} result1={result1} result2={result2} />
                    </Grid>
                  )}
                </>
              ) : (
                <>
                  <Grid item xs={12} lg={7}>
                    <TripForm trip={trip1} onChange={setTrip1} />
                  </Grid>

                  <Grid item xs={12} lg={5}>
                    {isValidTrip(trip1) ? (
                      <Box sx={{ position: 'sticky', top: 80 }}>
                        <Results result={result1} tripName={trip1.destination} />
                        <Box sx={{ mt: 2 }}>
                          <SaveShareExport trip={trip1} result={result1} contentRef={contentRef} />
                        </Box>
                      </Box>
                    ) : (
                      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                        <Calculator size={64} color="#ccc" style={{ marginBottom: 16 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Fill in trip details
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Enter your destination, travellers, and other expenses to see the calculation.
                        </Typography>
                      </Paper>
                    )}
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Container>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            bgcolor: 'grey.100',
            borderTop: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Trip Expense Calculator • Built with React + Material-UI • Calculates train, bus, flight, and car travel costs
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Copyright @Faiz Ahmad 2025
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
