import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  Timer as TimerIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { workshopService } from '../../services/workshopService';
import { useAuth } from '../../context/AuthContext';

const EnrolledWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrolledWorkshops();
  }, [user.id]);

  const fetchEnrolledWorkshops = async () => {
    try {
      const response = await workshopService.getWorkshopsByParticipant(user.id);
      setWorkshops(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch enrolled workshops');
      setLoading(false);
    }
  };

  const handleUnenroll = async (workshopId) => {
    try {
      await workshopService.removeParticipant(workshopId, user.id);
      setSnackbar({
        open: true,
        message: 'Successfully unenrolled from workshop',
        severity: 'success'
      });
      fetchEnrolledWorkshops();
      setOpenDialog(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to unenroll from workshop',
        severity: 'error'
      });
    }
  };

  const canUnenroll = (startDate) => {
    const now = new Date();
    const start = new Date(startDate);
    return now < start;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            My Enrolled Workshops
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage your workshop enrollments
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {workshops.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              You are not enrolled in any workshops
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/workshops')}
              sx={{ mt: 2 }}
            >
              Browse Workshops
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {workshops.map((workshop) => (
              <Grid item xs={12} md={6} key={workshop.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {workshop.workshopTitle}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={getWorkshopStatus(workshop.startDate, workshop.endDate)}
                        color={getStatusColor(workshop.startDate, workshop.endDate)}
                        sx={{ mb: 1 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {new Date(workshop.startDate).toLocaleDateString()} - {new Date(workshop.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TimerIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {new Date(workshop.startDate).toLocaleTimeString()} - {new Date(workshop.endDate).toLocaleTimeString()}
                      </Typography>
                    </Box>

                    {workshop.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {workshop.location}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/workshops/${workshop.id}`)}
                    >
                      View Details
                    </Button>
                    {canUnenroll(workshop.startDate) && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setSelectedWorkshop(workshop);
                          setOpenDialog(true);
                        }}
                      >
                        Unenroll
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Unenrollment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to unenroll from "{selectedWorkshop?.workshopTitle}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleUnenroll(selectedWorkshop?.id)}
            color="error"
            variant="contained"
          >
            Unenroll
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const getWorkshopStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'Upcoming';
  if (now > end) return 'Completed';
  return 'In Progress';
};

const getStatusColor = (startDate, endDate) => {
  const status = getWorkshopStatus(startDate, endDate);
  switch (status) {
    case 'Upcoming':
      return 'primary';
    case 'In Progress':
      return 'success';
    case 'Completed':
      return 'default';
    default:
      return 'default';
  }
};

export default EnrolledWorkshops;