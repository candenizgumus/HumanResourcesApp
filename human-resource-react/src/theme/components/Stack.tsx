import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Stack: Components<Omit<Theme, 'components'>>['MuiStack'] = {
  defaultProps: { useFlexGap: true },
};

export default Stack;
