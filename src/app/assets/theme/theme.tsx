import { Roboto } from "next/font/google"
import { createTheme } from "@mui/material/styles";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Colors } from "./colors";

const roboto = Roboto({
  weight:['300','400','500','700'],
  subsets: ['latin'],
  display: 'swap'
})

export const MuiCustomTheme = createTheme({
  palette:{
    mode: 'light',
    primary:{
      main: Colors.primary,
      contrastText: Colors.white
    },
    secondary: {
      main: Colors.secundary
    }
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize:'2rem',
      lineHeight: 2
    }
  }
});