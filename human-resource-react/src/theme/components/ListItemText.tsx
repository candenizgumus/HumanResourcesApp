import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const ListItemText: Components<Omit<Theme, 'components'>>['MuiListItemText'] = {
  defaultProps: { disableTypography: true },
  styleOverrides: {
    root: ({ theme }) => ({
      margin: 0,
      fontSize: theme.typography.fontSize + 4,
      fontWeight: theme.typography.fontWeightRegular,
    }),
  },
};

export default ListItemText;
