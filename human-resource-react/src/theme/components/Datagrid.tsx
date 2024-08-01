import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';
import type {} from '@mui/x-data-grid/themeAugmentation';

const DataGrid: Components<Omit<Theme, 'components'>>['MuiDataGrid'] = {
  defaultProps: {
    disableColumnMenu: true,
    disableRowSelectionOnClick: true,
    hideFooter: true,
    rowHeight: 65,
  },
  styleOverrides: {
    root: {
      borderRadius: 0,
      border: 0,
    },

    row: ({ theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.neutral.lighter,
      },
    }),

    columnHeader: {
      '&:focus-within': { outline: 'none' },
    },

    columnHeaderTitle: ({ theme }) => ({
      color: theme.palette.primary.darker,
      fontFamily: theme.typography.body1.fontFamily,
      fontSize: theme.typography.htmlFontSize,
      fontWeight: theme.typography.fontWeightMedium,
      marginRight: theme.spacing(1),
    }),

    cell: ({ theme }) => ({
      fontFamily: theme.typography.body1.fontFamily,
      fontSize: theme.typography.fontSize,
      '&:focus-within': { outline: 'none' },
    }),

    columnSeparator: {
      display: 'none',
    },

    sortIcon: ({ theme }) => ({
      color: theme.palette.primary.main,
    }),

    overlay: ({ theme }) => ({
      fontFamily: theme.typography.body1.fontFamily,
      fontSize: theme.typography.body1.fontSize,
    }),
  },
};

export default DataGrid;
