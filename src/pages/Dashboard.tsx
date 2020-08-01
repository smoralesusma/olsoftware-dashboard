import React, { useCallback, useState, useContext, useEffect } from "react";
import firebase from "firebase";
import {
  Box,
  Typography,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  makeStyles,
  useTheme } from "@material-ui/core";
import clsx from 'clsx';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Map,
  FormatListBulleted,
  Tune,
  InsertDriveFile, 
  ExitToApp, 
  AccountCircle, 
  FiberManualRecord } from '@material-ui/icons';

import firebaseInitApp from "../services/Firebase";
import UsersData from "../components/UsersData/UsersData";
import { AuthContext } from "../components/Tools/Auth";
import Loader from "../components/Tools/Loader";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    height: "100%",
    backgroundColor: "#F5F5F5"
  },
  title: {
    flexGrow: 1
  },
  userInfo: {
    px: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down('sm')]: {
      display: "none"
    }
  },
  userIcon: {
    fontSize: 30,
    padding: theme.spacing(2),
  },
  appBar: {
    width: `calc(100% - ${theme.spacing(9)}px)`,
    [theme.breakpoints.down('xs')]: {
      width: `calc(100% - ${theme.spacing(7)}px)`,
      flexShrink: 0,
    },
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.down('sm')]: {
      width: 0,
    },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerBackground: {
    background: "linear-gradient(180deg, rgba(80,170,223,1) 0%, rgba(41,74,159,1) 100%)",
  },
  drawerOpen: {
    width: drawerWidth,
    [theme.breakpoints.down('sm')]: {
      width: "100vw",
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  contentOpen: {
    width: `calc(100% - ${
      theme.spacing(3)+theme.spacing(9)+theme.spacing(3)+drawerWidth}px)`
  },
  contentClose: {
    width: `calc(100% - ${
      theme.spacing(3)+theme.spacing(9)+theme.spacing(3)}px)`
  }
}));

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(4);
  const [userFullName, setUserFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    if (currentUser) {
      const usersDB = firebase.firestore(firebaseInitApp).collection("USER");
      usersDB.get().then(async (users) => {
        users.docs.forEach(user => {
          const userData = user.data();
          if (userData.email === currentUser.email) {
            setUserFullName(`${userData.names} ${userData.lastnames}`);
          }
        });
      });
    } else setUserFullName('');
  }, [currentUser]);

  const onDrawerOpen = () => setOpen(true);
  const onDrawerClose = () => setOpen(false);

  const onLogOut = useCallback(async event => {
    setLoading(true);
    event.preventDefault();
    await firebaseInitApp.auth().signOut();
  },[]);

  const onRenderOption = () => {
    switch (state) {
      case 0:
        return <Box>Programación</Box>;
      case 1:
        return <Box>Gestión de operaciones</Box>;
      case 2:
        return <Box>Perfiles</Box>;
      case 3:
        return <Box>Roles</Box>;
      case 4:
        return <UsersData />;
      case 5:
        return <Box>Reportes</Box>;
      default:
        break;
    }
  }

  return <Box className={classes.root}>
    {loading && <Loader message="Saliendo..."/>}
    <AppBar
      color="secondary"
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}>
      <Toolbar>
        <IconButton
          color="primary"
          aria-label="open drawer"
          onClick={onDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: open,
          })}>
          <Menu/>
        </IconButton>
        <Typography
          color="primary"
          variant="h6"
          component="h1"
          className={classes.title}>
          Prueba Front-End
        </Typography>
        <Box className={classes.userInfo}>
          <AccountCircle color="primary" className={classes.userIcon}/>
          <Typography
            variant="subtitle1"
            component="p">{userFullName}
          </Typography>
        </Box>
        <IconButton color="primary" onClick={onLogOut}>
          <ExitToApp/>
        </IconButton>
      </Toolbar>
    </AppBar>
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx(classes.drawerBackground, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        }),
      }}>
      <Box className={classes.toolbar}>
        <ListItem style={{ padding: 8 }}>
          <ListItemIcon><FiberManualRecord fontSize="large"/></ListItemIcon>
          <ListItemText primary="OLSoftware"/>
        </ListItem>
        {open && <IconButton onClick={onDrawerClose} style={{ color: "#FFFFFF" }}>
          {theme.direction === 'rtl' ? <ChevronRight/> : <ChevronLeft />}
        </IconButton>}
      </Box>
      <Divider />
      <List>
        <ListItem
          button
          selected={state === 0 ?? false}
          onClick={() => setState(0)}>
          <ListItemIcon><Map/></ListItemIcon>
          <ListItemText primary="Programación"/>
        </ListItem>
        <ListItem
          button
          selected={state === 1 ?? false}
          onClick={() => setState(1)}>
          <ListItemIcon><FormatListBulleted/></ListItemIcon>
          <ListItemText primary="Gestión de operaciones" />
        </ListItem>
        <ListItem
          button
          selected={state === 2 ?? false}
          onClick={() => setState(2)}>
          <ListItemIcon><Tune/></ListItemIcon>
          <ListItemText primary="Perfiles"/>
        </ListItem>
        <ListItem
          button
          selected={state === 3 ?? false}
          onClick={() => setState(3)}>
          <ListItemIcon>
            <Typography
              style={{ marginLeft: 4 }}
              variant="h5"
              component="p">R</Typography>
          </ListItemIcon>
          <ListItemText color="secundary" primary="Roles"/>
        </ListItem>
        <ListItem
          button
          selected={state === 4 ?? false}
          onClick={() => setState(4)}>
          <ListItemIcon>
            <Typography
              style={{ marginLeft: 4 }}
              variant="h5"
              component="p">U</Typography>
          </ListItemIcon>
          <ListItemText primary="Usuarios"/>
        </ListItem>
        <ListItem
          button
          selected={state === 5 ?? false}
          onClick={() => setState(5)}>
          <ListItemIcon><InsertDriveFile/></ListItemIcon>
          <ListItemText primary="Reportes"/>
        </ListItem>
      </List>
    </Drawer>
    <main className={clsx(classes.content, {
        [classes.contentOpen]: open,
        [classes.contentClose]: !open,
      })}>
      <Box className={classes.toolbar} />
      {onRenderOption()}
    </main>
  </Box>
}

export default Dashboard;