import React from 'react';
import Login from '../components/Login';
import {
  Box,
  Container,
  Grid,
  Typography,
  makeStyles,
  useTheme } from '@material-ui/core';

import HomeBackground from "../media/imgs/home_background.png"

const Home = () => {
  const theme = useTheme();
  const useStyles = makeStyles({
    root: {
      backgroundImage: `url(${HomeBackground})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      MozBackgroundSize: "cover",
      WebkitBackgroundSize: "cover",
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    container: {
      padding: theme.spacing(1)
    },
    colorWhite: {
      color: "#FFFFFF"
    }
  });
  const classes = useStyles();

  return <Box className={classes.root}>
    <Container className={classes.container}>
      <Box py={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
              <Box mb={4} mt={2}>
                <Typography
                  className={classes.colorWhite}
                  variant="h3"
                  component="h1">
                    Aplicación<br/>OLSoftware</Typography>
              </Box>
              <Box>
                <Typography
                  className={classes.colorWhite}
                  variant="h6"
                  component="h2">
                    Prueba práctica Front-end senior</Typography>
              </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Login />
          </Grid>
        </Grid>
      </Box>
    </Container>
  </Box>
}

export default Home;
