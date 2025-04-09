import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3699ff',
      light: '#4dabff',
      dark: '#2d77cc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6c7293',
      light: '#8286a3',
      dark: '#565b76',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1e1e2d',
      paper: '#2b2b40',
    },
    text: {
      primary: '#ffffff',
      secondary: '#92929f',
    },
    error: {
      main: '#f64e60',
      light: '#f77c8b',
      dark: '#c53e4d',
    },
    success: {
      main: '#1bc5bd',
      light: '#48d0c9',
      dark: '#159e97',
    },
    warning: {
      main: '#ffa800',
      light: '#ffb933',
      dark: '#cc8600',
    },
    info: {
      main: '#8950fc',
      light: '#a173fd',
      dark: '#6e40ca',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});
