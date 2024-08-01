import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Badge: Components<Omit<Theme, 'components'>>['MuiBadge'] = {
  styleOverrides: {
    dot: ({ theme }) => ({
      backgroundColor: theme.palette.error.light,
    }),
  },
};

export default Badge;
