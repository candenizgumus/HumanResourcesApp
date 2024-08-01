import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Drawer: Components<Omit<Theme, 'components'>>['MuiDrawer'] = {
  styleOverrides: {
    paper: { borderRadius: 0, borderRight: 0 },
  },
};

export default Drawer;
