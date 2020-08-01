import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMuiTheme, ThemeOptions, ThemeProvider } from '@material-ui/core';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

import PrivateRoute from './components/Tools/PrivateRoute';
import AuthProvider from './components/Tools/Auth';

const createTheme = () => {
  let templateTheme: ThemeOptions = {};
  templateTheme.palette = {
    primary: {
      main: "#2E4A9F"
    },
    secondary: {
      main: "#FFFFFF"
    }
  }
  templateTheme.overrides = {
    MuiListItemText: {
      root: {
        color: "#FFFFFF !important"
      }
    },
    MuiListItemIcon: {
      root: {
        color: "#FFFFFF !important"
      }
    },
    MuiButton: {
      containedSecondary: {
        background: "linear-gradient(90deg, rgba(139,196,73,1) 0%, rgba(97,157,66,1) 100%)",
        color: "#FFFFFF"
      },
      outlinedSecondary: {
        color: "#8EC44B",
        border: "1px solid #8EC44B !important"
      }
    },
    MuiDialogActions: {
      root: {
        justifyContent: "center"
      }
    }
  }

  return createMuiTheme(templateTheme);
}

const App = () => {
  return <AuthProvider>
    <ThemeProvider theme={createTheme()}>
      <Router>
        <Route exact path="/" component={Home} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
      </Router>
    </ThemeProvider>
  </AuthProvider>
}

export default App;
