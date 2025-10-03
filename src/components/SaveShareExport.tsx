import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
} from '@mui/material';
import { Save, Share2, Download, Trash2, FolderOpen } from 'lucide-react';
import { TripData, CalculationResult } from '../utils/calculations';
import { useSavedTrips } from '../hooks/useLocalStorage';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SaveShareExportProps {
  trip: TripData;
  result: CalculationResult;
  contentRef: React.RefObject<HTMLElement>;
}

export default function SaveShareExport({ trip, result, contentRef }: SaveShareExportProps) {
  const { trips, saveTrip, deleteTrip } = useSavedTrips();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [tripName, setTripName] = useState(trip.destination || 'My Trip');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [shareAnchor, setShareAnchor] = useState<null | HTMLElement>(null);

  const handleSave = () => {
    try {
      saveTrip(tripName, trip);
      setSnackbar({ open: true, message: 'Trip saved successfully!', severity: 'success' });
      setSaveDialogOpen(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save trip', severity: 'error' });
    }
  };

  const handleShare = (method: 'copy' | 'native') => {
    const shareText = `Trip to ${trip.destination}
Travellers: ${trip.travellers} | Days: ${trip.days}
Total Cost: ₹${result.totalCost.toFixed(2)}
Cost Per Person: ₹${result.costPerPerson.toFixed(2)}

Breakdown:
- Transport: ₹${result.transportCost.toFixed(2)}
- Accommodation: ₹${result.accommodationCost.toFixed(2)}
- Food: ₹${result.foodCost.toFixed(2)}
- Local Transport: ₹${result.localTransportCost.toFixed(2)}
- Sightseeing: ₹${result.sightseeingCost.toFixed(2)}
- Miscellaneous: ₹${result.miscCost.toFixed(2)}
- Operational: ₹${result.operationalCost.toFixed(2)}

Calculated with Trip Expense Calculator`;

    if (method === 'native' && navigator.share) {
      navigator
        .share({
          title: `Trip to ${trip.destination}`,
          text: shareText,
        })
        .then(() => {
          setSnackbar({ open: true, message: 'Shared successfully!', severity: 'success' });
        })
        .catch(() => {
          setSnackbar({ open: true, message: 'Failed to share', severity: 'error' });
        });
    } else {
      navigator.clipboard.writeText(shareText).then(
        () => {
          setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        },
        () => {
          setSnackbar({ open: true, message: 'Failed to copy', severity: 'error' });
        }
      );
    }
    setShareAnchor(null);
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`trip-${trip.destination.replace(/\s+/g, '-').toLowerCase()}.pdf`);

      setSnackbar({ open: true, message: 'PDF downloaded successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to generate PDF', severity: 'error' });
    }
  };

  const handleDelete = (id: string) => {
    deleteTrip(id);
    setSnackbar({ open: true, message: 'Trip deleted', severity: 'success' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<Save size={18} />}
          onClick={() => setSaveDialogOpen(true)}
          aria-label="Save calculation"
        >
          Save
        </Button>

        <Button
          variant="outlined"
          startIcon={<FolderOpen size={18} />}
          onClick={() => setLoadDialogOpen(true)}
          disabled={trips.length === 0}
          aria-label="Load saved trip"
        >
          Load ({trips.length})
        </Button>

        <Button
          variant="outlined"
          startIcon={<Share2 size={18} />}
          onClick={(e) => setShareAnchor(e.currentTarget)}
          aria-label="Share result"
        >
          Share
        </Button>

        <Button
          variant="outlined"
          startIcon={<Download size={18} />}
          onClick={handleDownloadPDF}
          aria-label="Download as PDF"
        >
          PDF
        </Button>
      </Box>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Trip Calculation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Trip Name"
            fullWidth
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            aria-label="Trip name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!tripName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={loadDialogOpen} onClose={() => setLoadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Load Saved Trip</DialogTitle>
        <DialogContent>
          <List>
            {trips.map((savedTrip) => (
              <ListItem key={savedTrip.id} divider>
                <ListItemText
                  primary={savedTrip.name}
                  secondary={`Saved on ${new Date(savedTrip.createdAt).toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(savedTrip.id)}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoadDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={shareAnchor}
        open={Boolean(shareAnchor)}
        onClose={() => setShareAnchor(null)}
      >
        <MenuItem onClick={() => handleShare('copy')}>Copy to Clipboard</MenuItem>
        {navigator.share && (
          <MenuItem onClick={() => handleShare('native')}>Share via...</MenuItem>
        )}
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
