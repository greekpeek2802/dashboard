import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6EE7B7',
      light: '#A7F3D0',
      dark: '#34D399',
    },
    secondary: {
      main: '#818CF8',
    },
    background: {
      default: '#0B0F1A',
      paper: '#111827',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    divider: 'rgba(255,255,255,0.07)',
    error: { main: '#F87171' },
    warning: { main: '#FBBF24' },
    success: { main: '#6EE7B7' },
  },
  typography: {
    fontFamily: '"Golos Text", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h6: { fontWeight: 600 },
    body2: { color: '#94A3B8' },
    caption: { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
        contained: {
          background: 'linear-gradient(135deg, #6EE7B7, #34D399)',
          color: '#0B0F1A',
          '&:hover': { background: 'linear-gradient(135deg, #A7F3D0, #6EE7B7)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.7rem' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { color: '#94A3B8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
  },
});
