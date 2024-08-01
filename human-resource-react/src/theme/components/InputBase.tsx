import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const InputBase: Components<Omit<Theme, 'components'>>['MuiInputBase'] = {
  styleOverrides: {
    inputTypeSearch: ({ theme }) => ({
      padding: `${theme.spacing(1.5, 3, 1.5, 1)} !important`,
    }),
    inputHiddenLabel: ({ theme }) => ({
      paddingTop: `${theme.spacing(2.125)} !important`,
      paddingBottom: `${theme.spacing(2.125)} !important`,
    }),
  },
};

export default InputBase;
