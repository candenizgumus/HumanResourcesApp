import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const FilledInput: Components<Omit<Theme, 'components'>>['MuiFilledInput'] = {
  defaultProps: { disableUnderline: true },
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius * 4,
      paddingLeft: theme.spacing(3),
    }),

    input: ({ theme }) => ({
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.fontSize + 4,
      lineHeight: 1.5,
      paddingRight: theme.spacing(3),
    }),

    adornedStart: ({ theme }) => ({
      backgroundColor: theme.palette.neutral.light,
    }),
  },
};

export default FilledInput;
