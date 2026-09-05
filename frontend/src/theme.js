import { createTheme } from "@mui/material/styles";

// Design tokens — a quiet, journal-like feed rather than a generic SaaS dashboard.
// Background: warm paper. Accent: plum/coral, used sparingly. Dividers instead of
// shadowed cards. Fraunces for names/headings, Inter for body & UI chrome.
const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FBF9F6",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1C1B1A",
      secondary: "#6B6560",
    },
    primary: {
      main: "#A8395D",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#4F7965",
    },
    divider: "#E4DFD6",
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    h2: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    h3: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    h4: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    h5: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    h6: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { boxShadow: "none" },
        contained: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
  },
});

export default theme;
