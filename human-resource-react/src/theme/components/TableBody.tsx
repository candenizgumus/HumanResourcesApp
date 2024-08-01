import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const TableBody: Components<Omit<Theme, 'components'>>['MuiTableBody'] = {
  defaultProps: {},
  styleOverrides: {
    root: {
      '& :last-child > .MuiTableCell-root': {
        borderBottom: 0,
      },
    },
  },
};

export default TableBody;
