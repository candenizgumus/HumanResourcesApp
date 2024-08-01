import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Toolbar: Components<Omit<Theme, 'components'>>['MuiToolbar'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(0, 5),
    }),

    gutters: ({ theme }) => ({
      padding: theme.spacing(0, 2),

      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(0, 5),
      },
    }),
  },
};

export default Toolbar;
