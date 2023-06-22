import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import type {
  PaletteColor,
  SimplePaletteColorOptions,
  ThemeOptions,
} from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    surface: PaletteColor;
  }

  interface PaletteOptions {
    surface: SimplePaletteColorOptions;
  }
}

const baseTheme = createTheme({
  palette: {
    surface: {
      main: "#fff",
      dark: "#f3f7f7",
      contrastText: "#2a2a2a",
    },
    primary: {
      main: "#017d78",
    },
    secondary: {
      main: "#125f9b",
    },
  },
});

const lightTheme = createTheme(baseTheme, {
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.surface.main,
        },
      },
      defaultProps: {
        elevation: 1,
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.surface.main,
          color: baseTheme.palette.surface.contrastText,
        },
      },
      defaultProps: {
        elevation: 1,
      },
    },
  },
} as ThemeOptions);

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export default function ThemeProvider(props: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={lightTheme}>{props.children}</MuiThemeProvider>
  );
}
