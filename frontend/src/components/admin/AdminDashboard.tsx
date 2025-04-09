import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Snackbar
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Edit, Delete, Add, Visibility, Dashboard, AttachMoney, People, Email, Article, Help, Logout, MarkEmailUnread, MarkEmailRead } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import HelpRequestManagement from './HelpRequestManagement';

// Helper function to decode JWT token
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return { username: 'admin' };
  }
};

const DashboardCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: theme.palette.common.white,
  height: '100%'
}));

const StatsNumber = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1)
}));

interface DashboardStats {
  totalDonations: number;
  successfulDonations: number;
  totalAmount: number;
  activeNews: number;
  monthlyDonations: Array<{
    _id: { month: number; year: number };
    total: number;
  }>;
  donationDistribution: Array<{
    _id: string;
    total: number;
  }>;
}

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  createdAt: string;
  author: {
    username: string;
  };
  imageUrl: string;
  image: string;
  summary: string;
}

interface DonationItem {
  _id: string;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
}

interface VolunteerItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  status: string;
  joinedDate: string;
}

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'contact' | 'volunteer_request';
  status: 'read' | 'unread';
  skills?: string;
  availability?: string;
  createdAt: string;
}

interface HelpRequest {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  requesterName: string;
  requesterContact: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openNewsDialog, setOpenNewsDialog] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    summary: '',
    image: '',
    category: 'update',
    status: 'draft',
    author: ''
  });
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [openVolunteerDialog, setOpenVolunteerDialog] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerItem | null>(null);
  const [selectedHelp, setSelectedHelp] = useState<HelpRequest | null>(null);
  const [volunteerForm, setVolunteerForm] = useState<{
    name: string;
    email: string;
    phone: string;
    skills: string[];
    availability: string;
    status: string;
  }>({
    name: '',
    email: '',
    phone: '',
    skills: [],
    availability: 'full-time',
    status: 'active'
  });
  const [helpForm, setHelpForm] = useState({
    title: '',
    description: '',
    category: 'medical',
    priority: 'medium',
    status: 'pending',
    requesterName: '',
    requesterContact: ''
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data error:', err);
    }
  };

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/news', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.error('News fetch error:', err);
    }
  };

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/donations?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }

      const data = await response.json();
      setDonations(data.donations);
    } catch (err) {
      console.error('Donations fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/volunteers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch volunteers');
      const data = await response.json();
      setVolunteers(data);
    } catch (err) {
      console.error('Volunteers fetch error:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchHelpRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/help-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch help requests');
      const data = await response.json();
      setHelpRequests(data);
    } catch (err) {
      console.error('Help requests fetch error:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchNews();
    fetchDonations();
    fetchVolunteers();
    fetchMessages();
    fetchHelpRequests();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const url = selectedNews 
        ? `/api/admin/news/${selectedNews._id}`
        : '/api/admin/news';
      
      // Get the username from the token
      const decodedToken = parseJwt(token || '');
      const authorUsername = decodedToken.username || 'admin';

      const newsData = {
        ...newsForm,
        author: authorUsername
      };
      
      const response = await fetch(url, {
        method: selectedNews ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newsData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save news');
      }

      setOpenNewsDialog(false);
      await fetchNews();
      setNewsForm({
        title: '',
        content: '',
        summary: '',
        image: '',
        category: 'update',
        status: 'draft',
        author: ''
      });
      setSelectedNews(null);
      setSnackbar({
        open: true,
        message: `News ${selectedNews ? 'updated' : 'created'} successfully!`,
        severity: 'success'
      });
    } catch (err: any) {
      console.error('News save error:', err);
      setSnackbar({
        open: true,
        message: err?.message || 'Failed to save news. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete news');
      }

      fetchNews();
    } catch (err) {
      console.error('News delete error:', err);
    }
  };

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!volunteerForm.name || !volunteerForm.email || !volunteerForm.phone) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const url = selectedVolunteer 
        ? `/api/admin/volunteers/${selectedVolunteer._id}`
        : '/api/admin/volunteers';
      
      const response = await fetch(url, {
        method: selectedVolunteer ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(volunteerForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save volunteer');
      }

      setOpenVolunteerDialog(false);
      fetchVolunteers(); // Refresh the volunteers list
      setVolunteerForm({
        name: '',
        email: '',
        phone: '',
        skills: [],
        availability: 'full-time',
        status: 'active'
      });
      setSnackbar({
        open: true,
        message: `Volunteer ${selectedVolunteer ? 'updated' : 'added'} successfully`,
        severity: 'success'
      });
    } catch (err: any) {
      console.error('Volunteer save error:', err);
      setSnackbar({
        open: true,
        message: err?.message || 'Failed to save volunteer',
        severity: 'error'
      });
    }
  };

  const handleDeleteVolunteer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/volunteers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete volunteer');
      }

      fetchVolunteers(); // Refresh the volunteers list
    } catch (err) {
      console.error('Volunteer delete error:', err);
    }
  };

  const handleMessageStatus = async (messageId: string, status: 'read' | 'unread') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/messages/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update message status');
      }

      fetchMessages(); // Refresh messages list
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(17, 25, 40, 0.95) 0%, rgba(33, 150, 243, 0.8) 100%)'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const chartData = stats?.monthlyDonations.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    amount: item.total
  })) || [];

  const pieData = stats?.donationDistribution.map(item => ({
    name: item._id || 'General',
    value: item.total
  })) || [];

  const MessageDialog = ({ message, open, onClose }: { message: Message | null, open: boolean, onClose: () => void }) => {
    if (!message) return null;

    const handleAddAsVolunteer = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        // Create volunteer object from message data
        const volunteerData = {
          name: message.name,
          email: message.email,
          phone: message.phone || '',
          skills: message.skills ? message.skills.split(',').map(skill => skill.trim()) : [],
          availability: message.availability || 'full-time',
          status: 'active'
        };

        // Send request to add volunteer
        const response = await fetch('/api/admin/volunteers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(volunteerData)
        });

        if (!response.ok) {
          throw new Error('Failed to add volunteer');
        }

        // Update message status to 'read'
        await fetch(`/api/admin/messages/${message._id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'read' })
        });

        // Show success message
        setSnackbar({
          open: true,
          message: 'Volunteer added successfully',
          severity: 'success'
        });

        // Refresh volunteers list
        fetchVolunteers();
        // Refresh messages list
        fetchMessages();
        
        // Close dialog
        onClose();
      } catch (error) {
        console.error('Error adding volunteer:', error);
        setSnackbar({
          open: true,
          message: 'Failed to add volunteer',
          severity: 'error'
        });
      }
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {message.type === 'volunteer_request' ? 'Volunteer Application' : 'Message'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">From</Typography>
              <Typography variant="body1">{message.name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">Email</Typography>
              <Typography variant="body1">{message.email}</Typography>
            </Grid>
            {message.phone && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                <Typography variant="body1">{message.phone}</Typography>
              </Grid>
            )}
            {message.type === 'volunteer_request' && (
              <>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Skills</Typography>
                  <Typography variant="body1">{message.skills}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Availability</Typography>
                  <Typography variant="body1">{message.availability}</Typography>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">Message</Typography>
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {message.message}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          {message.type === 'volunteer_request' && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAsVolunteer}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                }
              }}
            >
              Add as Volunteer
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary',
      pb: 4
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'background.paper',
        boxShadow: '0 0 50px 0 rgba(82,63,105,.15)',
        py: 2,
        px: 3,
        mb: 4
      }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Admin Dashboard
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
              }}
              startIcon={<Logout />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          '& .MuiTab-root': {
            color: 'text.primary',
            '&.Mui-selected': {
              color: 'text.primary'
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'text.primary'
          }
        }}
      >
        <Tab icon={<Dashboard />} label="Dashboard" />
        <Tab icon={<AttachMoney />} label="Funds" />
        <Tab icon={<People />} label="Volunteers" />
        <Tab icon={<Email />} label="Messages" />
        <Tab icon={<Article />} label="News & Stories" />
        <Tab icon={<Help />} label="Help Requests" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {/* Stats Cards */}
            <Grid item xs={12} md={3}>
              <DashboardCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Total Donations</Typography>
                  <StatsNumber>₹{stats?.totalAmount.toLocaleString()}</StatsNumber>
                  <Typography variant="body2" color="text.secondary">
                    From {stats?.totalDonations} donations
                  </Typography>
                </CardContent>
              </DashboardCard>
            </Grid>

            <Grid item xs={12} md={3}>
              <DashboardCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Successful Donations</Typography>
                  <StatsNumber>{stats?.successfulDonations}</StatsNumber>
                  <Typography variant="body2" color="text.secondary">
                    Success rate: {stats?.totalDonations ? ((stats.successfulDonations / stats.totalDonations) * 100).toFixed(1) : 0}%
                  </Typography>
                </CardContent>
              </DashboardCard>
            </Grid>

            <Grid item xs={12} md={3}>
              <DashboardCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Average Donation</Typography>
                  <StatsNumber>
                    ₹{stats?.successfulDonations ? (stats.totalAmount / stats.successfulDonations).toFixed(0) : 0}
                  </StatsNumber>
                  <Typography variant="body2" color="text.secondary">
                    Per transaction
                  </Typography>
                </CardContent>
              </DashboardCard>
            </Grid>

            <Grid item xs={12} md={3}>
              <DashboardCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Active News</Typography>
                  <StatsNumber>{stats?.activeNews || 0}</StatsNumber>
                  <Typography variant="body2" color="text.secondary">
                    Published articles
                  </Typography>
                </CardContent>
              </DashboardCard>
            </Grid>

            {/* Donation Chart */}
            <Grid item xs={12} md={8}>
              <DashboardCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Donation Trends</Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="amount" stroke="#2196F3" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </DashboardCard>
            </Grid>

            {/* Distribution Pie Chart */}
            <Grid item xs={12} md={4}>
              <DashboardCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Donation Distribution</Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </DashboardCard>
            </Grid>

            {/* Recent Donations Table */}
            <Grid item xs={12}>
              <DashboardCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Recent Donations</Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => {
                        const token = localStorage.getItem('adminToken');
                        if (token) {
                          window.location.href = `/api/admin/donations/export?token=${token}`;
                        }
                      }}
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        borderRadius: 2
                      }}
                    >
                      Export Report
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'text.primary' }}>Transaction ID</TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>Amount</TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>Status</TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>Date</TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {donations.map((donation) => (
                          <TableRow key={donation._id}>
                            <TableCell sx={{ color: 'text.primary' }}>{donation.transactionId}</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>₹{donation.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Chip
                                label={donation.status}
                                sx={{
                                  bgcolor: donation.status === 'completed' 
                                    ? 'rgba(76, 175, 80, 0.1)' 
                                    : donation.status === 'pending'
                                    ? 'rgba(255, 152, 0, 0.1)'
                                    : 'rgba(244, 67, 54, 0.1)',
                                  color: donation.status === 'completed'
                                    ? '#4CAF50'
                                    : donation.status === 'pending'
                                    ? '#FF9800'
                                    : '#F44336',
                                  borderRadius: 1
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>
                              {new Date(donation.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <IconButton size="small" sx={{ color: 'text.primary' }}>
                                <Visibility />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </DashboardCard>
            </Grid>
          </Grid>
        </Container>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', mb: 3 }}>Funds Management</Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <DashboardCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Total Funds</Typography>
                    <StatsNumber>₹{stats?.totalAmount.toLocaleString()}</StatsNumber>
                    <Typography variant="body2" color="text.secondary">
                      Available Balance
                    </Typography>
                  </CardContent>
                </DashboardCard>
              </Grid>
              <Grid item xs={12}>
                <DashboardCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Recent Transactions</Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        sx={{
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          borderRadius: 2
                        }}
                      >
                        Export Transactions
                      </Button>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: 'text.primary' }}>Transaction ID</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>Type</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>Amount</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>Status</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {donations.map((donation) => (
                            <TableRow key={donation._id}>
                              <TableCell sx={{ color: 'text.primary' }}>{donation.transactionId}</TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>Donation</TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>₹{donation.amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Chip
                                  label={donation.status}
                                  sx={{
                                    bgcolor: donation.status === 'completed' 
                                      ? 'rgba(76, 175, 80, 0.1)' 
                                      : donation.status === 'pending'
                                      ? 'rgba(255, 152, 0, 0.1)'
                                      : 'rgba(244, 67, 54, 0.1)',
                                    color: donation.status === 'completed'
                                      ? '#4CAF50'
                                      : donation.status === 'pending'
                                      ? '#FF9800'
                                      : '#F44336',
                                    borderRadius: 1
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>
                                {new Date(donation.createdAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </DashboardCard>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', mb: 3 }}>Volunteers Management</Typography>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <DashboardCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Volunteers List</Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                          setSelectedVolunteer(null);
                          setVolunteerForm({
                            name: '',
                            email: '',
                            phone: '',
                            skills: [],
                            availability: 'full-time',
                            status: 'active'
                          });
                          setOpenVolunteerDialog(true);
                        }}
                        sx={{
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          borderRadius: 2
                        }}
                      >
                        Add Volunteer
                      </Button>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: 'text.primary' }}>Name</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>Email</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>Phone</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>Skills</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>Status</TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {volunteers.map((volunteer) => (
                            <TableRow key={volunteer._id}>
                              <TableCell sx={{ color: 'text.primary' }}>{volunteer.name}</TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>{volunteer.email}</TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>{volunteer.phone}</TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>
                                {volunteer.skills.map((skill) => (
                                  <Chip
                                    key={skill}
                                    label={skill}
                                    size="small"
                                    sx={{
                                      m: 0.5,
                                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                                      color: '#2196F3'
                                    }}
                                  />
                                ))}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={volunteer.status}
                                  sx={{
                                    bgcolor: volunteer.status === 'active' 
                                      ? 'rgba(76, 175, 80, 0.1)' 
                                      : 'rgba(244, 67, 54, 0.1)',
                                    color: volunteer.status === 'active'
                                      ? '#4CAF50'
                                      : '#F44336',
                                    borderRadius: 1
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton 
                                  size="small" 
                                  sx={{ color: 'text.primary' }}
                                  onClick={() => {
                                    setSelectedVolunteer(volunteer);
                                    setVolunteerForm({
                                      name: volunteer.name,
                                      email: volunteer.email,
                                      phone: volunteer.phone,
                                      skills: volunteer.skills,
                                      availability: volunteer.availability,
                                      status: volunteer.status
                                    });
                                    setOpenVolunteerDialog(true);
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  sx={{ color: 'text.primary' }}
                                  onClick={() => handleDeleteVolunteer(volunteer._id)}
                                >
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </DashboardCard>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>Messages</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((message) => (
                <TableRow 
                  key={message._id}
                  sx={{
                    backgroundColor: message.status === 'unread' ? 'rgba(33, 150, 243, 0.1)' : 'inherit'
                  }}
                >
                  <TableCell>
                    {new Date(message.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={message.type === 'volunteer_request' ? 'Volunteer' : 'Contact'}
                      color={message.type === 'volunteer_request' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell>
                    <Chip 
                      label={message.status}
                      color={message.status === 'unread' ? 'warning' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      onClick={() => {
                        setSelectedMessage(message);
                        setMessageDialogOpen(true);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => handleMessageStatus(
                        message._id, 
                        message.status === 'read' ? 'unread' : 'read'
                      )}
                    >
                      {message.status === 'read' ? <MarkEmailUnread /> : <MarkEmailRead />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', mb: 3 }}>News & Stories</Typography>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <DashboardCard>
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">News Articles</Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                          setSelectedNews(null);
                          setNewsForm({
                            title: '',
                            content: '',
                            summary: '',
                            image: '',
                            category: 'update',
                            status: 'draft',
                            author: ''
                          });
                          setOpenNewsDialog(true);
                        }}
                        sx={{
                          background: 'linear-gradient(45deg, #3699ff 30%, #4dabff 90%)',
                          borderRadius: 2
                        }}
                      >
                        Add News
                      </Button>
                    </Box>

                    {loading ? (
                      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                      </Box>
                    ) : error ? (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    ) : news.length === 0 ? (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        No news articles found.
                      </Alert>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ color: 'text.primary' }}>Title</TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>Category</TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>Status</TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>Date</TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {news.map((item) => (
                              <TableRow key={item._id}>
                                <TableCell sx={{ color: 'text.primary' }}>{item.title}</TableCell>
                                <TableCell sx={{ color: 'text.primary' }}>{item.category}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={item.status}
                                    size="small"
                                    sx={{
                                      bgcolor: item.status === 'published' 
                                        ? 'rgba(46, 204, 113, 0.1)'
                                        : 'rgba(255, 152, 0, 0.1)',
                                      color: item.status === 'published'
                                        ? '#2ecc71'
                                        : '#ff9800',
                                      borderRadius: 1
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ color: 'text.primary' }}>
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    sx={{ color: 'text.primary' }}
                                    onClick={() => {
                                      setSelectedNews(item);
                                      setNewsForm({
                                        title: item.title,
                                        content: item.content,
                                        summary: item.summary || '',
                                        image: item.image || '',
                                        category: item.category,
                                        status: item.status,
                                        author: item.author?.username || ''
                                      });
                                      setOpenNewsDialog(true);
                                    }}
                                  >
                                    <Edit />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    sx={{ color: 'text.primary' }}
                                    onClick={() => handleDeleteNews(item._id)}
                                  >
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                </DashboardCard>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <HelpRequestManagement />
      </TabPanel>

      {/* News Dialog */}
      <Dialog 
        open={openNewsDialog} 
        onClose={() => setOpenNewsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedNews ? 'Edit News' : 'Add News'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              required
              variant="outlined"
              value={newsForm.title}
              onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
            />
            <TextField
              label="Summary"
              fullWidth
              required
              variant="outlined"
              value={newsForm.summary}
              onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
            />
            <TextField
              label="Content"
              fullWidth
              required
              multiline
              rows={4}
              variant="outlined"
              value={newsForm.content}
              onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
            />
            <TextField
              select
              label="Category"
              fullWidth
              required
              variant="outlined"
              value={newsForm.category}
              onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
            >
              <MenuItem value="update">Update</MenuItem>
              <MenuItem value="story">Story</MenuItem>
              <MenuItem value="news">News</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              fullWidth
              required
              variant="outlined"
              value={newsForm.status}
              onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value })}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </TextField>
            <TextField
              label="Image URL"
              fullWidth
              required
              variant="outlined"
              value={newsForm.image}
              onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
              helperText="Enter the URL of the image"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewsDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleNewsSubmit}
            variant="contained"
            disabled={!newsForm.title || !newsForm.summary || !newsForm.content || !newsForm.image}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              borderRadius: 2
            }}
          >
            {selectedNews ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Volunteer Dialog */}
      <Dialog 
        open={openVolunteerDialog} 
        onClose={() => setOpenVolunteerDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedVolunteer ? 'Edit Volunteer' : 'Add Volunteer'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              variant="outlined"
              value={volunteerForm.name}
              onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              value={volunteerForm.email}
              onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
            />
            <TextField
              label="Phone"
              fullWidth
              variant="outlined"
              value={volunteerForm.phone}
              onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
            />
            <TextField
              label="Skills (comma-separated)"
              fullWidth
              variant="outlined"
              value={volunteerForm.skills.join(', ')}
              onChange={(e) => setVolunteerForm({ 
                ...volunteerForm, 
                skills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill !== '') 
              })}
              helperText="Enter skills separated by commas (e.g., 'Teaching, First Aid, Cooking')"
            />
            <TextField
              select
              label="Availability"
              fullWidth
              variant="outlined"
              value={volunteerForm.availability}
              onChange={(e) => setVolunteerForm({ ...volunteerForm, availability: e.target.value })}
            >
              <MenuItem value="full-time">Full Time</MenuItem>
              <MenuItem value="part-time">Part Time</MenuItem>
              <MenuItem value="weekends">Weekends</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              fullWidth
              variant="outlined"
              value={volunteerForm.status}
              onChange={(e) => setVolunteerForm({ ...volunteerForm, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVolunteerDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleVolunteerSubmit}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              borderRadius: 2
            }}
          >
            {selectedVolunteer ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help Request Dialog */}
      <Dialog 
        open={openHelpDialog} 
        onClose={() => setOpenHelpDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedHelp ? 'Edit Help Request' : 'Add Help Request'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              variant="outlined"
              value={helpForm.title}
              onChange={(e) => setHelpForm({ ...helpForm, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={helpForm.description}
              onChange={(e) => setHelpForm({ ...helpForm, description: e.target.value })}
            />
            <TextField
              select
              label="Category"
              fullWidth
              variant="outlined"
              value={helpForm.category}
              onChange={(e) => setHelpForm({ ...helpForm, category: e.target.value })}
            >
              <MenuItem value="medical">Medical</MenuItem>
              <MenuItem value="education">Education</MenuItem>
              <MenuItem value="food">Food</MenuItem>
              <MenuItem value="shelter">Shelter</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              select
              label="Priority"
              fullWidth
              variant="outlined"
              value={helpForm.priority}
              onChange={(e) => setHelpForm({ ...helpForm, priority: e.target.value })}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              fullWidth
              variant="outlined"
              value={helpForm.status}
              onChange={(e) => setHelpForm({ ...helpForm, status: e.target.value })}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
            <TextField
              label="Requester Name"
              fullWidth
              variant="outlined"
              value={helpForm.requesterName}
              onChange={(e) => setHelpForm({ ...helpForm, requesterName: e.target.value })}
            />
            <TextField
              label="Requester Contact"
              fullWidth
              variant="outlined"
              value={helpForm.requesterContact}
              onChange={(e) => setHelpForm({ ...helpForm, requesterContact: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHelpDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              borderRadius: 2
            }}
          >
            {selectedHelp ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <MessageDialog 
        message={selectedMessage}
        open={messageDialogOpen}
        onClose={() => {
          setMessageDialogOpen(false);
          setSelectedMessage(null);
        }}
      />

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

    </Box>
  );
};

export default AdminDashboard; 