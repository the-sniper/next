import { createTheme } from '@mui/material/styles';

const globalTheme = createTheme({
  helpers: {
    drawerWidth: '15rem',
    navigationTopHeight: '2.5rem',
    navigationBottomHeight: '4rem',
    navigationTotalHeight: '6.5rem',
  },
  breakpoints: {
    values: {
      xs: 0,
      mobile: 600,
      sm: 768,
      md: 1028,
      lg: 1280,
      xl: 1600,
      xxl: 1920,
    },
  },
  palette: {
    primary: {
      main: '#7D0000',
    },
    secondary: {
      main: '#2B2B2B',
    },
    common: {
      starColor: '#7D0000',
      green: '#228B22',
      winning: '#008000',
      weak: '#F25F5C',
      fair: '#FFE066',
      good: '#247BA0',
      strong: '#70C1B3',
      accent: '#979797',
      lost: '#2B2B2B',
      outbid: '#AE2207',
      red: '#AE2207',
      smoke: '#F5F5F5',
      tan: '#DABA95',
    },
    status: {
      unpaid: '#FF4D00',
      unpaidBorder: '#FF5B14',
      paid: '#00CE2D',
      paidBorder: '#25D54B',
      delinquentBackground: '#FFEDED',
    },
    fees: {
      red: '#ED213A',
      redHover: '#F14D61',
    },
    cancel: {
      red: '#C91E22',
      redBackground: '#C91E221A',
      yellow: '#EBCE10',
      yellowBackground: '#EBCE101A',
      green: '#3AAF47',
      greenBackground: '#3AAF471A',
    },
    gradient: {
      sinCity: 'linear-gradient(104.02deg, #ED213A 8.61%, #93291E 55.61%)',
      sinCityLight: 'linear-gradient(104.02deg, #EF374E 8.61%, #9E3E35 55.61%)',
    },
    background: {
      default: '#F5F5F5',
      secondary: '#E9C6911A',
    },
    text: {
      primary: '#2B2B2B',
      secondary: '#7D0000',
    },
    warning: {
      main: '#F44336',
    },
  },
  spacing: 10,
  typography: {
    fontFamily: [
      'Open Sans',
      '"Segoe UI"',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
    fontSize: 16,
    fontWeightMedium: 600,
    fontWeightBold: 800,
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h3: {
      fontSize: '1.5rem',
    },
    h4: {
      fontSize: '1.3rem',
    },
    h5: {
      fontSize: '1.2rem',
    },
    h6: {
      fontSize: '1.1rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.9rem',
    },
  },
});

export const theme = createTheme(globalTheme, {
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: globalTheme.typography.fontFamily,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: globalTheme.palette.primary.light,
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: globalTheme.palette.secondary.light,
          },
        },
        text: {
          minWidth: 0,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
        textPrimary: {
          '&:hover': {
            color: globalTheme.palette.primary.light,
          },
        },
        textSecondary: {
          '&:hover': {
            color: globalTheme.palette.secondary.light,
          },
        },
      },
    },
  },
});
