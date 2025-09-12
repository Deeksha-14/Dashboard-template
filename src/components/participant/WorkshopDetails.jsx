// filepath: src/components/participant/WorkshopDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Button,
  Divider
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Group
} from '@mui/icons-material';
import { workshopService } from '../../services/workshopService';

const WorkshopDetails = () => {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkshopDetails();
  }, [id]);

  const fetchWorkshopDetails = async () => {
    try {
      const response = await workshopService.getWorkshopById(id);
      setWorkshop(response.data);
    } catch (error) {
      setError('Failed to fetch workshop details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            {workshop?.workshopTitle}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" paragraph>
                {workshop?.description}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Details
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarToday sx={{ mr: 1 }} />
                  <Typography>
                    {new Date(workshop?.startDate).toLocaleDateString()} - {new Date(workshop?.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOn sx={{ mr: 1 }} />
                  <Typography>
                    {workshop?.location}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }} elevation={3}>
                <Typography variant="h6" gutterBottom>
                  Workshop Status
                </Typography>
                <Chip
                  label={getWorkshopStatus(workshop?.startDate, workshop?.endDate)}
                  color={getStatusColor(workshop?.startDate, workshop?.endDate)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Enroll Now
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

// Helper functions (same as in ParticipantHome)
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

export default WorkshopDetails;