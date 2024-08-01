import { Components, Theme } from '@mui/material';

const ListItemButton: Components<Omit<Theme, 'components'>>['MuiListItemButton'] = {
  styleOverrides: {
    gutters: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius * 4,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.common.white,
      },

      '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected,
        color: theme.palette.common.white,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      },
    }),
  },
};
export default ListItemButton;
