import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';
import scrollbar from '../styles/scrollbar';
import echart from '../styles/echart';

const CssBaseline: Components<Omit<Theme, 'components'>>['MuiCssBaseline'] = {
  styleOverrides: (theme) => ({
    body: {
      fontVariantLigatures: 'none',
      ...scrollbar(theme),
    },
    ...echart(),
  }),
};

export default CssBaseline;
