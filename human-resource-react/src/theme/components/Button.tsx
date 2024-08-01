import { Components, Theme } from '@mui/material';

const Button: Components<Omit<Theme, 'components'>>['MuiButton'] = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      textTransform: 'none',
      borderRadius: theme.shape.borderRadius * 2,
      fontSize: theme.typography.htmlFontSize, // 16px
      padding: theme.spacing(1, 2), // 8px, 16px
      lineHeight: 1.5,
    }),

    sizeSmall: ({ theme }) => ({
      fontSize: theme.typography.fontSize, // 14px
      padding: theme.spacing(0.75, 1.25), // 6px, 10px
    }),

    sizeLarge: ({ theme }) => ({
      fontSize: theme.typography.fontSize + 4, // 18px
      padding: theme.spacing(1.25, 2.75), // 10px, 22px
    }),

    containedPrimary: {
      fontWeight: 600,
    },

    outlinedPrimary: ({ theme }) => ({
      color: theme.palette.text.primary,
      borderColor: theme.palette.neutral.dark,
    }),

    startIcon: {
      '& > *:first-of-type': {
        fontSize: 16,
      },
    },
    endIcon: {
      '& > *:first-of-type': {
        fontSize: 14,
      },
    },
  },
};

export default Button;
