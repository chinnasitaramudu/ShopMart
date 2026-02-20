/*
 * Purpose: Central MUI theme for premium grocery styling (green palette, soft shadows, modern typography).
 * API Integration: No API logic; purely visual configuration consumed globally.
 * State Management: Stateless configuration object.
 * Navigation Flow: Shared styles ensure consistent UX across route transitions.
 * Backend Connection: Independent from backend; visual layer only.
 */
import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32',
      light: '#66bb6a',
      dark: '#1b5e20'
    },
    secondary: {
      main: '#00a651'
    },
    background: {
      default: '#f4f7f5',
      paper: '#ffffff'
    },
    text: {
      primary: '#1d2a22',
      secondary: '#60736a'
    }
  },
  typography: {
    fontFamily: ['Poppins', 'Inter', 'sans-serif'].join(','),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 14
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 24px rgba(24, 55, 38, 0.08)'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    }
  }
})
