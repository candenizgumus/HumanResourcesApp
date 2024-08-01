import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const MenuItem: Components<Omit<Theme, 'components'>>['MuiMenuItem'] = {
  defaultProps: {},
  styleOverrides: {
    root: ({ theme }) => ({
      '&:hover': { color: theme.palette.common.white },
      '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected,
        color: theme.palette.common.white,
      },
      '&.Mui-selected:hover': { backgroundColor: theme.palette.action.selected },
    }),
  },
};

export default MenuItem;
