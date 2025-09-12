import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Autocomplete,
  CircularProgress,
  Alert,
  Snackbar,
  Divider
} from '@mui/material';
import {
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { workshopService } from '../../services/workshopService';
import { userService } from '../../services/userService';

const WorkshopParticipants = () => {
  const { workshopId } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchData();
  }, [workshopId]);

  const fetchData = async () => {
    try {
      const [workshopRes, participantsRes, usersRes] = await Promise.all([
        workshopService.getWorkshopById(workshopId),
        workshopService.getParticipants(workshopId),
        userService.getAllUsers()
      ]);

      setWorkshop(workshopRes.data);
      setParticipants(participantsRes.data);
      
      // Filter out users who are already participants
      const availableParticipants = usersRes.data.filter(
        user => user.role === 'PARTICIPANT' && 
        !participantsRes.data.find(p => p.id === user.id)
      );
      setAvailableUsers(availableParticipants);
      
      setLoading(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch data',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleAddParticipant = async () => {
    if (!selectedUser) return;
    
    try {
      await workshopService.addParticipant(workshopId, selectedUser.id);
      setSnackbar({
        open: true,
        message: 'Participant added successfully',
        severity: 'success'
      });
      setOpenDialog(false);
      setSelectedUser(null);
      fetchData(); // Refresh the data
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add participant',
        severity: 'error'
      });
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    try {
      await workshopService.removeParticipant(workshopId, participantId);
      setSnackbar({
        open: true,
        message: 'Participant removed successfully',
        severity: 'success'
      });
      fetchData(); // Refresh the data
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to remove participant',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {workshop?.workshopTitle}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Manage Workshop Participants
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mt: 2 }}
          >
            Add Participant
          </Button>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Current Participants ({participants.length})
          </Typography>
          <List>
            {participants.map((participant) => (
              <React.Fragment key={participant.id}>
                <ListItem>
                  <ListItemText
                    primary={`${participant.firstName} ${participant.lastName}`}
                    secondary={participant.email}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => handleRemoveParticipant(participant.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
            {participants.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No participants enrolled"
                  sx={{ color: 'text.secondary' }}
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>

      {/* Add Participant Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Participant</DialogTitle>
        <DialogContent sx={{ width: 400 }}>
          <Autocomplete
            options={availableUsers}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
            value={selectedUser}
            onChange={(_, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Participant"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddParticipant}
            variant="contained"
            disabled={!selectedUser}
          >
            Add
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

export default WorkshopParticipants;