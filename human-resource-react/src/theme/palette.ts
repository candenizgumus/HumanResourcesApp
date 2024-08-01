import { PaletteColorOptions, PaletteOptions } from '@mui/material/styles';
import { indigo, grey, orange, red, green, purple, blue, yellow } from './colors';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: PaletteColor;
    green: PaletteColor;
    orange: PaletteColor;
    red: PaletteColor;
    yellow: PaletteColor;
  }

  interface PaletteOptions {
    neutral?: PaletteColorOptions;
    green?: PaletteColorOptions;
    orange?: PaletteColorOptions;
    red?: PaletteColorOptions;
    yellow?: PaletteColorOptions;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }
}

const palette: PaletteOptions = {
  grey,
  text: {
    primary: indigo[600],
    secondary: indigo[200],
  },

  action: {
    hover: indigo[300],
    selected: indigo[500],
  },

  neutral: {
    lighter: grey[50],
    light: grey[300],
    main: grey[500],
    dark: grey[700],
    darker: grey[900],
    contrastText: '#fff',
  },

  primary: {
    lighter: indigo[50],
    light: indigo[300],
    main: indigo[500],
    dark: indigo[700],
    darker: indigo[900],
  },

  secondary: {
    lighter: purple[50],
    light: purple[300],
    main: purple[500],
    dark: purple[700],
    darker: purple[900],
  },

  error: {
    lighter: red[50],
    light: red[300],
    main: red[500],
    dark: red[700],
    darker: red[900],
  },

  warning: {
    lighter: orange[50],
    light: orange[300],
    main: orange[500],
    dark: orange[700],
    darker: orange[900],
  },

  success: {
    lighter: green[50],
    light: green[300],
    main: green[500],
    dark: green[700],
    darker: green[900],
  },

  info: {
    lighter: blue[50],
    light: blue[300],
    main: blue[500],
  },

  green: {
    light: green[100],
    main: green[200],
    dark: green[400],
    darker: green[600],
  },

  orange: {
    main: orange[400],
  },

  red: {
    main: red[800],
  },

  yellow: {
    main: yellow[500],
  },
};

export default palette;
