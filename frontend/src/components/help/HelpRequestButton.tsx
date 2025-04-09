import React, { useState } from 'react';
import { 
  Fab, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  DialogActions, 
  Button, 
  Badge, 
  Avatar, 
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { styled, keyframes } from '@mui/material/styles';

// Define animations
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  left: theme.spacing(4),
  animation: `${float} 3s ease-in-out infinite, ${pulse} 2s infinite`,
  background: theme.palette.primary.main,
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
    color: theme.palette.primary.contrastText,
  },
  '&:hover': {
    transform: 'scale(1.1)',
    background: theme.palette.primary.dark,
    transition: 'transform 0.2s, background 0.2s',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  },
}));

const RequestCard = styled('div')(({ theme }) => ({
  padding: '16px',
  margin: '8px 0',
  border: '1px solid',
  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 4px 12px rgba(0, 0, 0, 0.5)' 
      : '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

interface HelpRequest {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'inProgress' | 'resolved';
  createdAt: string;
  email?: string;
  name?: string;
}

export const HelpRequestButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [activeRequests, setActiveRequests] = useState<HelpRequest[]>([]);
  const [viewMode, setViewMode] = useState<'new' | 'list'>('new');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setTitleError('');
    setDescriptionError('');
    setEmailError('');

    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else if (title.length < 3) {
      setTitleError('Title must be at least 3 characters long');
      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    } else if (description.length < 10) {
      setDescriptionError('Description must be at least 10 characters long');
      isValid = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/help-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          email: email.trim() || undefined,
          name: name.trim() || undefined,
        }),
      });
      
      if (response.ok) {
        setTitle('');
        setDescription('');
        setEmail('');
        setName('');
        await fetchRequests();
        setViewMode('list');
        setSnackbarOpen(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit help request');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error submitting help request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const url = email ? `/api/v1/help-requests?email=${encodeURIComponent(email)}` : '/api/v1/help-requests';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setActiveRequests(data);
      }
    } catch (error) {
      console.error('Error fetching help requests:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchRequests();
  };

  const handleClose = () => {
    setOpen(false);
    setViewMode('new');
    setTitle('');
    setDescription('');
    setTitleError('');
    setDescriptionError('');
    setError(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffa726';
      case 'inProgress': return '#2196f3';
      case 'resolved': return '#4caf50';
      default: return '#757575';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'inProgress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  return (
    <>
      <StyledFab 
        color="primary" 
        onClick={handleOpen}
        aria-label="help"
      >
        <Badge badgeContent={activeRequests.filter(r => r.status !== 'resolved').length} color="error">
          <HelpIcon />
        </Badge>
      </StyledFab>

      <StyledDialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          {viewMode === 'new' ? 'Submit Help Request' : 'Your Help Requests'}
          <Button 
            variant="outlined"
            onClick={() => setViewMode(viewMode === 'new' ? 'list' : 'new')}
            size="small"
          >
            {viewMode === 'new' ? 'View Requests' : 'New Request'}
          </Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {viewMode === 'new' ? (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTitleError('');
                }}
                error={!!titleError}
                helperText={titleError}
                disabled={isSubmitting}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setDescriptionError('');
                }}
                error={!!descriptionError}
                helperText={descriptionError}
                disabled={isSubmitting}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Your Name (Optional)"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Email Address (Optional)"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                error={!!emailError}
                helperText={emailError}
                disabled={isSubmitting}
                sx={{ mb: 1 }}
              />
            </>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {activeRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  No help requests yet
                </div>
              ) : (
                activeRequests.map((request) => (
                  <RequestCard key={request.id}>
                    <div style={{ marginBottom: '8px' }}>
                      <h3 style={{ margin: '0 0 8px 0' }}>{request.title}</h3>
                      <p style={{ margin: '0 0 12px 0', color: 'text.secondary' }}>
                        {request.description}
                      </p>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center'
                    }}>
                      <Chip
                        label={getStatusLabel(request.status)}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(request.status)}20`,
                          color: getStatusColor(request.status),
                          fontWeight: 'medium',
                        }}
                      />
                      <span style={{ 
                        color: 'text.secondary', 
                        fontSize: '0.875rem'
                      }}>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </RequestCard>
                ))
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={handleClose} 
            color="inherit" 
            disabled={isSubmitting}
          >
            Close
          </Button>
          {viewMode === 'new' && (
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={isSubmitting || !title || !description}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </DialogActions>
      </StyledDialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Help request submitted successfully"
      />
    </>
  );
};
