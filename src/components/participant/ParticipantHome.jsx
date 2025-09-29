import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  EventAvailable,
  School,
  CalendarToday,
  Timeline,
  LocationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { workshopService } from '../../services/workshopService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import config from '../../configurations/config.js'

const ParticipantHome = () => {
  const [enrolledWorkshops, setEnrolledWorkshops] = useState([]);
  const [availableWorkshops, setAvailableWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkshops();
  }, [user.id]);

  const fetchWorkshops = async () => {
    try {
      // First, get all workshops the participant is enrolled in
      const enrolledResponse = await workshopService.getWorkshopsByParticipant(user.id);
      setEnrolledWorkshops(enrolledResponse.data);

      // Then get all available workshops
      const allWorkshopsResponse = await workshopService.getAllWorkshops();
      // Filter out already enrolled workshops
      const availableWorkshopsFiltered = allWorkshopsResponse.data.filter(
        workshop => !enrolledResponse.data.some(
          enrolledWorkshop => enrolledWorkshop.id === workshop.id
        )
      );
      setAvailableWorkshops(availableWorkshopsFiltered);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workshops:', error);
      setError('Failed to fetch workshops');
      setLoading(false);
    }
  };

  const renderWorkshopCard = (workshop) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {workshop.workshopTitle}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Chip
            label={getWorkshopStatus(workshop.startDate, workshop.endDate)}
            color={getStatusColor(workshop.startDate, workshop.endDate)}
            sx={{ mr: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarToday sx={{ mr: 1, fontSize: 'small', color: 'primary.main' }} />
          <Typography variant="body2">
            {new Date(workshop.startDate).toLocaleDateString()} - {new Date(workshop.endDate).toLocaleDateString()}
          </Typography>
        </Box>

        {workshop.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOn sx={{ mr: 1, fontSize: 'small', color: 'primary.main' }} />
            <Typography variant="body2">
              {workshop.location}
            </Typography>
          </Box>
        )}

        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {workshop.description}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Stack>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.name}!
            </Typography>
            <Typography variant="subtitle1">
              You are enrolled in {enrolledWorkshops.length} workshop{enrolledWorkshops.length !== 1 ? 's' : ''}
            </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Enrolled Workshops Section */}
        <Grid item xs={12} md={6}>
          <Stack>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              My Enrolled Workshops
            </Typography>
            {enrolledWorkshops.length === 0 ? (
              <Box textAlign="center" py={3}>
                <Typography color="textSecondary">
                  You haven't enrolled in any workshops yet
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/workshops')}
                >
                  Browse Workshops
                </Button>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                {enrolledWorkshops.map((workshop) => renderWorkshopCard(workshop))}
              </Box>
            )}
          </Paper>
        {/* </Grid>

        {/* Available Workshops Section */}
        {/* <Grid item xs={12} md={6}> */}
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Available Workshops
            </Typography>
            {availableWorkshops.length === 0 ? (
              <Box textAlign="center" py={3}>
                <Typography color="textSecondary">
                  No new workshops available at the moment
                </Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                {availableWorkshops.map((workshop) => renderWorkshopCard(workshop))}
              </Box>
            )}
          </Paper>
          
        {/* </Grid>

        {/* Quick Actions Section */}
        {/* <Grid item xs={12} md={9}>  */}
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Stack display="flex" gap={2}>
                {/* Existing buttons */}
                <Button
                  variant="contained"
                  startIcon={<EventAvailable />}
                  color="primary"
                >
                  View Schedule
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Timeline />}
                  color="success"
                >
                  My Progress
                </Button>
                {/* Add the new JupyterHub button */}
                <Button
                  variant="contained"
                  startIcon={<OpenInNewIcon />}
                  color="success"
                  //onClick={() => window.open('http://localhost:8000', '_blank')}
                  onClick={() => window.open(config.JUPYTER_URL, '_blank')}
                  sx={{
                    bgcolor: '#F37626', // Jupyter's brand color
                    '&:hover': {
                      bgcolor: '#D65F0D'
                    }
                  }}
                >
                  Jupyter Notebook
                </Button>
              </Stack>
            </CardContent>
          </Card>
          </Stack>
        </Grid>
      </Grid>
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

export default ParticipantHome;