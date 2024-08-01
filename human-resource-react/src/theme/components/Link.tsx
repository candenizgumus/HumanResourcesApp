import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';
import { forwardRef } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

// eslint-disable-next-line
const LinkBehavior = forwardRef<any, Omit<RouterLinkProps, 'to'> & { href?: string }>(
  (props, ref) => <RouterLink ref={ref} to={props.href || ''} {...props} />,
);

const Link: Components<Omit<Theme, 'components'>>['MuiLink'] = {
  defaultProps: {
    component: LinkBehavior,
    underline: 'none',
  },
};

export default Link;
