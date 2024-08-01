import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const TableCell: Components<Omit<Theme, 'components'>>['MuiTableCell'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderBottomColor: theme.palette.grey.A100,
    }),

    head: ({ theme }) => ({
      fontFamily: theme.typography.body2.fontFamily,
      fontWeight: theme.typography.body2.fontWeight,
      fontSize: theme.typography.body2.fontSize,
      lineHeight: theme.typography.body2.lineHeight,
      color: theme.palette.neutral.main,
      padding: theme.spacing(1.25, 3.25),
    }),

    body: ({ theme }) => ({
      color: theme.palette.neutral.darker,
      padding: theme.spacing(2.25, 3.25),
    }),
  },
};

export default TableCell;
