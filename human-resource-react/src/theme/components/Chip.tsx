import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Chip: Components<Omit<Theme, 'components'>>['MuiChip'] = {
  styleOverrides: {
    outlined: ({ theme }) => ({
      height: theme.spacing(3),
      borderRadius: theme.shape.borderRadius * 2,
      fontFamily: theme.typography.body2.fontFamily,
      fontWeight: theme.typography.body2.fontWeight,
      fontSize: theme.typography.body2.fontSize,
      lineHeight: theme.typography.body2.lineHeight,
    }),
    filled: ({ theme }) => ({
      height: theme.spacing(3),
      borderRadius: theme.shape.borderRadius * 2,
      fontSize: theme.typography.subtitle2.fontSize,
    }),
  },
};

export default Chip;
