import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router/Router.js';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';  
import OccupationServiceProvider from './services/OccupationServiceProvider';

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#1b45a0',
    },
    secondary: {
      main: '#d50000',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components:{
    MuiAppBar: {
      styleOverrides:{
        colorInherit: {
          backgroundColor: '#002845',
          color: '#fff',
        },
      },
      defaultProps:{
        color: 'inherit',
      }
    }
  },
});

ReactDOM.render(
  <React.StrictMode>
    <OccupationServiceProvider>
    <ThemeProvider theme = { theme }>
          <Router />
    </ThemeProvider>
    </OccupationServiceProvider>
  </React.StrictMode>,
  document.getElementById('root')
);