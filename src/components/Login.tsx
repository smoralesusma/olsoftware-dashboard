import React, { useState, useCallback, useContext, ChangeEvent } from "react";
import firebase from "firebase";
import forge from "node-forge";
import { Redirect, useHistory } from "react-router";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Button,
  useTheme,
  makeStyles,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, 
  Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { PersonOutlineOutlined, LockOutlined, Dialpad } from "@material-ui/icons"

import firebaseInitApp from "../services/Firebase";
import { AuthContext } from "./Tools/Auth";
import Loader from "./Tools/Loader";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 20,
    MozBorderRadius: 20,
    WebkitBorderRadius: 20,
    padding: theme.spacing(6)
  },
  input: {
    "&&&:before": {
      borderBottom: "none"
    },
    "&&:after": {
      borderBottom: "none"
    }
  }
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPin, setRegisterPin] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    type: "success" | "info" | "warning" | "error",
    message: string, time?: number } | null>(null);

  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles(theme);

  const onLoginWithMail = useCallback(async event => {
    event.preventDefault();
    setLoading(true);

    // eslint-disable-next-line
    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = mailRegex.test(email.toLowerCase());

    if (validEmail) {
      const hmacPass = forge.hmac.create();
        hmacPass.start("sha256", process.env.REACT_APP_PIN_SALT!);
        hmacPass.update(password);
      const hashPass = hmacPass.digest().toHex();

      firebaseInitApp.auth()
        .signInWithEmailAndPassword(email, hashPass)
        .then((result: firebase.auth.UserCredential) => {
          if (result.user) history.push("/dashboard");
        }).catch((error: Error) => setSnackbar({ type:"error", message: error.message }));
    } else setSnackbar({ type:"error", message: "No es un correo válido" });
  }, [email, password, history, setLoading]);

  const onLoginWithGmail = useCallback(
    async event => {
      event.preventDefault();
      setLoading(true);

      const provider = new firebase.auth.GoogleAuthProvider();
      firebaseInitApp.auth().signInWithPopup(provider)
        .then((result: firebase.auth.UserCredential) => {
          if (result.user) history.push('/');
        }).catch((error: Error) => setSnackbar({ type:"error", message: error.message }));
    },
    [history, setLoading]
  );

  const onRegister = useCallback(async event => {
    event.preventDefault();
    setLoading(true);

    // eslint-disable-next-line
    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = mailRegex.test(registerEmail.toLowerCase());

    const hmac = forge.hmac.create();
      hmac.start("sha256", process.env.REACT_APP_PIN_SALT!);
      hmac.update(registerPin);
    const hash = hmac.digest().toHex();
    
    if (hash === process.env.REACT_APP_PIN_HASH)
      if (validEmail) {
        const hmacPass = forge.hmac.create();
          hmacPass.start("sha256", process.env.REACT_APP_PIN_SALT!);
          hmacPass.update(registerPassword);
        const hashPass = hmacPass.digest().toHex();
        
        firebaseInitApp.auth()
          .createUserWithEmailAndPassword(registerEmail, hashPass)
          .then((result: firebase.auth.UserCredential) => {
            if (result.user) history.push('/');
          }).catch((error: Error) => setSnackbar({ type:"error", message: error.message }));
      } else setSnackbar({ type:"error", message: "No es un correo válido" });
    else setSnackbar({ type:"error", message: "No es un PIN válido" });
  }, [registerEmail, registerPassword, registerPin, history, setLoading]);

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    setEmail(event.target.value.trim());
  }

  const onChangePassword = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    setPassword(event.target.value.trim());
  }

  const onChangeRegisterEmail = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    setRegisterEmail(event.target.value.trim());
  }

  const onChangeRegisterPassword = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    setRegisterPassword(event.target.value.trim());
  }

  const onChangeRegisterPin = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    setRegisterPin(event.target.value.trim());
  }

  const onOpenRegisterDialog = () => setOpen(true);
  const onCloseRegisterDialog = () => setOpen(false);

  const { currentUser } = useContext(AuthContext);

  if (currentUser) return <Redirect to="/dashboard" />;
  else return <Paper className={classes.root} elevation={6}>
    {loading && <Loader message="Estamos preparando todo para tí"/>}
    <Typography align="center" variant="h4" component="h2">Inicio de sesión</Typography>
    <Box my={5}>
      <Box boxShadow={5} borderRadius={0}>
        <Box p={1}>
          <FormControl fullWidth>
            <InputLabel htmlFor="input-email">Correo</InputLabel>
            <Input
              id="input-email"
              className={classes.input}
              type="text"
              value={email}
              onChange={onChangeEmail}
              endAdornment={<InputAdornment position="end">
                <PersonOutlineOutlined/>
              </InputAdornment>}
            />
          </FormControl>
        </Box>
        <Divider color="#f0f0f0"/>
        <Box p={1}>
          <FormControl fullWidth>
            <InputLabel htmlFor="input-password">Contraseña</InputLabel>
            <Input
              id="input-password"
              className={classes.input}
              fullWidth
              type="password"
              value={password}
              onChange={onChangePassword}
              endAdornment={<InputAdornment position="end">
                <LockOutlined/>
              </InputAdornment>}
            />
          </FormControl>
        </Box>
      </Box>
    </Box>
    <Box mb={1} mt={4}>
      <Button
        onClick={onLoginWithMail}
        variant="contained"
        color="primary"
        fullWidth>Iniciar sesión</Button>
    </Box>
    <Divider color="#f0f0f0"/>
    <Box my={1}>
      <Button
        onClick={onLoginWithGmail}
        variant="contained"
        color="default"
        fullWidth>Iniciar con Google</Button>
    </Box>
    <Box textAlign="center" mt={4}>
      <Button variant="outlined" onClick={onOpenRegisterDialog}>Crear cuenta</Button>
      <Dialog open={open} onClose={onCloseRegisterDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Registro</DialogTitle>
        <DialogContent>
          <Box p={1}>
            <FormControl fullWidth>
              <InputLabel htmlFor="input-register-email">Correo</InputLabel>
              <Input
                id="input-register-email"
                className={classes.input}
                type="text"
                value={registerEmail}
                onChange={onChangeRegisterEmail}
                endAdornment={<InputAdornment position="end">
                  <PersonOutlineOutlined/>
                </InputAdornment>}
              />
            </FormControl>
          </Box>
          <Divider color="#f0f0f0"/>
          <Box p={1}>
            <FormControl fullWidth>
              <InputLabel htmlFor="input-register-password">Contraseña</InputLabel>
              <Input
                id="input-register-password"
                className={classes.input}
                fullWidth
                type="password"
                value={registerPassword}
                onChange={onChangeRegisterPassword}
                endAdornment={<InputAdornment position="end">
                  <LockOutlined/>
                </InputAdornment>}
              />
            </FormControl>
          </Box>
          <Divider color="#f0f0f0"/>
          <Box p={1}>
            <FormControl fullWidth>
              <InputLabel htmlFor="input-register-pin">PIN</InputLabel>
              <Input
                id="input-register-pin"
                className={classes.input}
                fullWidth
                type="password"
                value={registerPin}
                onChange={onChangeRegisterPin}
                endAdornment={<InputAdornment position="end">
                  <Dialpad/>
                </InputAdornment>}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onCloseRegisterDialog} color="primary">
            Cancelar
          </Button>
          <Button variant="contained" onClick={onRegister} color="primary">
            Registrarme
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    <Snackbar
      open={snackbar !== null}
      autoHideDuration={snackbar?.time ?? 6000}
      onClose={() => setSnackbar(null)}>
      <Alert onClose={() => setSnackbar(null)} severity={snackbar?.type}>
        {snackbar?.message}
      </Alert>
    </Snackbar>
  </Paper>
}

export default Login;