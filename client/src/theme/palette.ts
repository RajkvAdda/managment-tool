import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const PRIMARY = (color: string) => ({
  lighter: alpha(color, 0.1),
  light: alpha(color, 0.3),
  main: color,
  dark: alpha(color, 0.7),
  darker: alpha(color, 0.9),
  contrastText: '#fff',
});

const SECONDARY = (color: string) => ({
  lighter: alpha(color, 0.1),
  light: alpha(color, 0.3),
  main: color,
  dark: alpha(color, 0.7),
  darker: alpha(color, 0.9),
  contrastText: '#fff',
});

const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
  contrastText: '#fff',
};

const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: GREY[800],
};

const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#fff',
};

const palette = ({ mode, primary, secondary }: { mode: 'light' | 'dark'; primary: string; secondary: string }) => ({
  mode,
  common: { black: '#000', white: '#fff' },
  primary: PRIMARY(mode === 'light' ? primary : 'rgb(220, 220, 220)'),
  secondary: SECONDARY(mode === 'light' ? secondary : 'rgb(220, 220, 220)'),
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: mode === 'light' ? alpha(GREY[500], 0.24) : 'rgba(255, 255, 255, 0.1)',
  text:
    mode === 'light'
      ? {
          primary: GREY[800],
          secondary: GREY[600],
          disabled: GREY[500],
        }
      : {
          primary: '#fff',
          secondary: '#E5EAF2',
          disabled: 'rgb(240, 240, 240)',
          primaryChannel: 'rgba(255, 255, 255, 0.05)',
          secondaryChannel: '#2c3540',
        },
  background:
    mode === 'light'
      ? {
          paper: '#fff',
          default: GREY[100],
          neutral: GREY[200],
        }
      : {
          default: 'rgb(23, 28, 36)',
          paper: 'rgb(34, 43, 54)',
          neutral: GREY[200],
        },
  action:
    mode === 'light'
      ? {
          active: PRIMARY(primary).light,
          hover: alpha(GREY[500], 0.08),
          selected: PRIMARY(primary).lighter,
          disabled: alpha(GREY[500], 0.8),
          disabledBackground: alpha(GREY[500], 0.24),
          focus: alpha(GREY[500], 0.24),
          hoverOpacity: 0.08,
          disabledOpacity: 0.48,
        }
      : {
          active: PRIMARY(primary).light,
          hover: alpha(GREY[500], 0.08),
          selected: PRIMARY(primary).lighter,
          disabled: alpha(GREY[500], 0.8),
          disabledBackground: alpha(GREY[500], 0.24),
          focus: alpha(GREY[500], 0.24),
          hoverOpacity: 0.08,
          disabledOpacity: 0.48,
        },
});
export default palette;
