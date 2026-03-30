import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: { main: "#111827" },
        background: { default: "#fafafa", paper: "#ffffff" },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: { main: "#e5e7eb" },
        background: { default: "#0b0f19", paper: "#0f172a" },
      },
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      'var(--font-geist-sans), system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiContainer: {
      defaultProps: { maxWidth: "sm" },
    },
    MuiButton: {
      defaultProps: { variant: "contained", disableElevation: true },
    },
  },
});

