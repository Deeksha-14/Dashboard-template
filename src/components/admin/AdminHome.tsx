import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Grid from '@mui/material/Grid';
import { workshopService } from '../../services/workshopService';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Chip,
  Snackbar,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  LinearProgress,
  Drawer,
  AppBar,
  Toolbar,
  ListItemIcon,
  ListItemButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  EventNote as EventIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarTodayIcon,
  BarChart as BarChartIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { WorkshopResponse } from '../../types/workshop';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

const drawerWidth = 240;

const AdminHome = () => {
  // Move all hook calls inside the component function
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [workshops, setWorkshops] = useState<WorkshopResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await workshopService.getAllWorkshops();
      setWorkshops(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch workshops');
      setLoading(false);
    }
  };

  const handleDeleteWorkshop = async (id: string) => {
    try {
      await workshopService.deleteWorkshop(id);
      setSnackbar({ open: true, message: 'Workshop deleted successfully', severity: 'success' });
      fetchWorkshops();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete workshop', severity: 'error' });
    }
  };

const getProgressValue = (title: string) => {
  switch(title) {
    case 'Total Workshops': return Math.min((workshops.length / 50) * 100, 100);
    case 'Active Participants': return (150 / 200) * 100;
    case 'Completion Rate': return 85;
    case 'Total Participants': return (1015 / 1200) * 100;
    default: return 0;
  }
};

const getProgressColor = (title: string) => {
  switch(title) {
    case 'Total Workshops': return 'linear-gradient(90deg, #1976d2, #42a5f5)';
    case 'Active Participants': return 'linear-gradient(90deg, #2e7d32, #66bb6a)';
    case 'Completion Rate': return 'linear-gradient(90deg, #0288d1, #29b6f6)';
    case 'Total Participants': return 'linear-gradient(90deg, #ed6c02, #ff9800)';
    default: return '#8884d8';
  }
};


  const handleSearchWorkshop = async () => {
    try {
      const response = await workshopService.searchByTitle(searchQuery);
      setWorkshops(response.data);
    } catch (err) {
      setError('Failed to search workshops');
    }
  };

  const getStatusChip = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return <Chip label="Upcoming" color="primary" />;
    } else if (now > end) {
      return <Chip label="Completed" color="default" />;
    }
    return <Chip label="Ongoing" color="success" />;
  };

  const columns: GridColDef[] = [
    { field: 'workshopTitle', headerName: 'Title', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => new Date(params.value as string).toLocaleDateString()
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => new Date(params.value as string).toLocaleDateString()
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => getStatusChip(params.row.startDate, params.row.endDate)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton onClick={() => navigate(`/workshops/edit/${params.row.id}`)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => navigate(`/admin/workshops/${params.row.id}/participants`)}>
            <GroupIcon color="secondary" />
          </IconButton>
          <IconButton onClick={() => handleDeleteWorkshop(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      )
    }
  ];

  const stats = [
    {
      title: 'Total Workshops',
      value: workshops.length,
      icon: <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: 'Active Participants',
      value: '150',
      icon: <GroupIcon sx={{ fontSize: 40, color: 'success.main' }} />
    },
    {
      title: 'Completion Rate',
      value: '85%',
      icon: <AssessmentIcon sx={{ fontSize: 40, color: 'info.main' }} />
    },
    {
      title: 'Total Participants',
      value: '1,015',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main' }} />
    }
  ];

  // Mock data for charts
  const enrollmentData = [
    { name: 'QST', enrollments: 140 },
    { name: 'QC', enrollments: 135 },
    { name: 'Qacc', enrollments: 190 },
    { name: 'QIC', enrollments: 220 },
    { name: 'QC2', enrollments: 150 },
    { name: 'QT&AI', enrollments: 180 },
  ];

  const workshopStatusData = [
    { name: 'Upcoming', value: 5 },
    { name: 'Ongoing', value: 3 },
    { name: 'Completed', value: 7 },
  ];

  const participantProgressData = [
    { name: 'QIC', completed: 20, ongoing: 80 },
    { name: 'QC', completed: 40, ongoing: 60 },
    { name: 'Quantum Theory', completed: 60, ongoing: 40 },
    { name: 'Quantum Symposium', completed: 80, ongoing: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const recentActivities = [
    { action: 'New workshop created', workshop: 'Quantum Information Theory', date: '2023-07-01' },
    { action: 'Participant enrolled', workshop: 'Introduction to Quantum Computing', date: '2023-04-14' },
    { action: 'Workshop completed', workshop: 'Workshop on Quantum Computing', date: '2023-04-13' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
      handleProfileMenuClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfile = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Workshops', icon: <EventIcon />, path: '/admin/workshops' },
    { text: 'Participants', icon: <GroupIcon />, path: '/admin/participants' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/admin/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const drawer = (
    <Box sx={{ mt: 8 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                minHeight: 48,
                px: 2.5,
                '&.active': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {/* Welcome Section */}
            <Grid item xs={12} component={'section'}>
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
                  Welcome, {user?.name || 'Admin'}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white' }}>
                  Manage your workshops and participants from this dashboard
                </Typography>
              </Paper>
            </Grid>

            {/* Stats Cards - Stable, evenly spaced, professional */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                  gap: 3,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  alignItems: 'stretch',
                  mb: 2,
                  width: '100%'
                }}
              >
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    sx={{
                      flex: { xs: '1 1 220px', md: '1' },
                      minWidth: 220,
                      // maxWidth: 320,
                      borderRadius: 2,
                      boxShadow: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // flexGrowth: 4,
                      p: 2,
                      background: 'linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)',
                    }}
                  >
                    <CardContent sx={{ width: '100%', p: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {stat.icon}
                        <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary', fontWeight: 600 }}>
                          {stat.title}
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>{stat.value}</Typography>
                      <LinearProgress
            variant="determinate"
            value={(() => {
              switch(stat.title) {
                case 'Total Workshops':
                  return Math.min((workshops.length / 50) * 100, 100); // Assuming target of 50 workshops
                case 'Active Participants':
                  return (150 / 200) * 100; // 150 out of 200 target
                case 'Completion Rate':
                  return 85; // Already a percentage
                case 'Total Participants':
                  return (1015 / 1200) * 100; // 1015 out of 1200 target
                default:
                  return 0;
              }
            })()}
            sx={{ 
              mt: 2, 
              height: 8, 
              borderRadius: 5, 
              background: '#e3e3e3',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                background: (() => {
                  switch(stat.title) {
                    case 'Total Workshops':
                      return 'linear-gradient(90deg, #1976d2, #42a5f5)';
                    case 'Active Participants':
                      return 'linear-gradient(90deg, #2e7d32, #66bb6a)';
                    case 'Completion Rate':
                      return 'linear-gradient(90deg, #0288d1, #29b6f6)';
                    case 'Total Participants':
                      return 'linear-gradient(90deg, #ed6c02, #ff9800)';
                    default:
                      return '#8884d8';
                  }
                })()
              }
            }}
          />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>

            {/* Enrollment Trend Chart */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Enrolled Participants</Typography>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <Box sx={{ minWidth: '600px', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={enrollmentData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          height={60}
                          tick={{ angle: -45, textAnchor: 'end', dy: 10 }}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="enrollments" stroke="#8884d8" fill="#8884d8" strokeWidth={2}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Workshop Status Chart */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Workshop Status</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={workshopStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {workshopStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Participant Progress Chart */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Participant Progress</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={participantProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#8884d8" />
                    <Bar dataKey="ongoing" stackId="a" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/workshops/create')}
                  sx={{ 
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                  }}
                >
                  Create Workshop
                </Button>
                <TextField
                  size="small"
                  placeholder="Search workshops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchWorkshop()}
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small" onClick={handleSearchWorkshop}>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{ flexGrow: 1, maxWidth: 300 }}
                />
              </Box>
            </Grid>

            {/* Workshops Table */}
            <Grid item xs={12}>
              <Paper sx={{ height: 400, borderRadius: 2, boxShadow: 3 }}>
                <DataGrid
                  rows={workshops}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  checkboxSelection
                  disableSelectionOnClick
                  loading={loading}
                />
              </Paper>
            </Grid>

            {/* Recent Activities */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                <List>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                            <CalendarTodayIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.action}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {activity.workshop}
                              </Typography>
                              {` — ${activity.date}`}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                <Grid container spacing={2}>
                  {['Generate Report', 'Send Notifications', 'Update Schedule', 'Manage Users'].map((action, index) => (
                    <Grid item xs={6} key={index}>
                      <Button 
                        variant="outlined" 
                        fullWidth
                        startIcon={[<BarChartIcon />, <NotificationsIcon />, <EventIcon />, <GroupIcon />][index]}
                      >
                        {action}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AdminHome;
