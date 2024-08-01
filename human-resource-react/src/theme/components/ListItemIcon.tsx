import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const ListItemIcon: Components<Omit<Theme, 'components'>>['MuiListItemIcon'] = {
  styleOverrides: {
    root: {
      minWidth: 'auto',
    },
  },
};

export default ListItemIcon;
