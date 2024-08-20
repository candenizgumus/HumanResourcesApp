import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Palette, PaletteOptions } from '@mui/material/styles/createPalette';

// Extend the Palette and PaletteOptions interfaces
declare module '@mui/material/styles' {
  interface Palette {
    myLightColour: Palette['primary'];
    myBackgroundColour: Palette['primary'];
    mySecondaryColor: Palette['primary'];
  }
  interface PaletteOptions {
    myLightColour?: PaletteOptions['primary'];
    myBackgroundColour?: PaletteOptions['primary'];
    mySecondaryColor?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
    palette: {
      primary: {
        main: '#222831',
        dark: '#00ADB5',
      },
      myLightColour: {
        main: '#00ADB5',
      },
      myBackgroundColour: {
        main: '#EEEEEE',
      },
      mySecondaryColor: {
        main: '#393E46'
      }
    },
  });

  type RootElementProps = {
    children: React.ReactNode;
  };


  function ThemeElement({ children }: RootElementProps) {
    return (
      <ThemeProvider theme={theme}>
          {children}
      </ThemeProvider>
    );
  }

export default ThemeElement