import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const PaginationItem: Components<Omit<Theme, 'components'>>['MuiPaginationItem'] = {
  defaultProps: {},
  styleOverrides: {
    text: ({ theme }) => ({
      fontFamily: theme.typography.body1.fontFamily,
      fontSize: theme.typography.fontSize,
      '&:hover': {
        color: theme.palette.common.white,
      },
    }),
  },
};

export default PaginationItem;
