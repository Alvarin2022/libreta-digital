import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#126AA5",
      light: "#4A9FD2",
      dark: "#0C4D7D",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#256F91",
      light: "#6DB7D8",
      dark: "#174D68",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#16769A",
      light: "#53A9C9",
      dark: "#10536E",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F2F8FC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#163A52",
      secondary: "#5F7686",
    },
    divider: "#D7E7F1",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#F2F8FC" },
      },
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
});

export default theme;
