import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const AppBar: Components<Omit<Theme, 'components'>>['MuiAppBar'] = {
  styleOverrides: {
    colorPrimary: ({ theme }) => ({
      backgroundColor: theme.palette.background.default,
      color: theme.palette.primary.darker,
      borderRadius: 0,
    }),
  },
};

export default AppBar;
