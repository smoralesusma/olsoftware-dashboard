import React, { useState } from "react";
import firebase from "firebase";
import forge from "node-forge";
import {
  Box,
  Grid,
  Button,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Select,
  MenuItem,
  Snackbar,
  useTheme,
  makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Close } from "@material-ui/icons";

import { IUserData } from "./UsersData";
import firebaseInitApp, { onCreateUser } from "../../services/Firebase";

export interface ICreateUserButton {
  setUser: (newUserData: IUserData) => void
}

const CreateUserButton = ({ setUser }: ICreateUserButton) => {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    type: "success" | "info" | "warning" | "error",
    message: string, time?: number } | null>(null);

  const theme = useTheme();
  const useStyles = makeStyles({
    root: {
      maxWidth: 900,
      padding: theme.spacing(4)
    },
    form: {
      padding: theme.spacing(4)
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(4),
      top: theme.spacing(4),
      color: theme.palette.error.main,
    }
  });
  const classes = useStyles();

  const onOpenRegisterDialog = () => setOpen(true);
  const onCloseRegisterDialog = () => setOpen(false);

  const onRegister = (event: any) => {
    event.preventDefault();
    const {
      names,
      lastnames,
      identification,
      rol,
      state,
      password,
      phone,
      email } = event.target.elements;

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const hmac = forge.hmac.create();
      hmac.start("sha256", process.env.REACT_APP_PIN_SALT!);
      hmac.update(passwordValue);
    const hash = hmac.digest().toHex();

    // eslint-disable-next-line
    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = mailRegex.test(emailValue.toLowerCase());
    
    if (validEmail) {
      onCreateUser(emailValue, hash).then((response) => {
        console.log(response.data);
        const newUserData: IUserData = {
          names: names.value.trim(),
          lastnames: lastnames.value.trim(),
          identification: Number(identification.value.trim()),
          rol: rol.value.trim(),
          state: Number(state.value) === 1 ? true : false,
          phone: Number(phone.value.trim()),
          email: emailValue
        }
        const usersDB = firebase.firestore(firebaseInitApp).collection("USER");
        usersDB.add(newUserData).then((user) => {
          newUserData.id = user.id;
          setUser(newUserData);
          onCloseRegisterDialog()
        }).catch((error: Error) => setSnackbar({ type:"error", message: error.message }));
      }).catch((error: Error) => setSnackbar({ type:"error", message: error.message }));
    } else setSnackbar({ type:"error", message: "No es un correo válido" });
  }

  return <Box>
    <Button color="primary" variant="contained" onClick={onOpenRegisterDialog}>Crear</Button>
    <Dialog
      open={open}
      classes={{ paper: classes.root }}
      onClose={onCloseRegisterDialog}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" disableTypography>
        <Typography variant="h6">Agregar nuevo usuario</Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={onCloseRegisterDialog}>
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={onRegister} className={classes.form}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-names">Nombres</InputLabel>
                <OutlinedInput
                  required
                  id="input-names"
                  type="text"
                  name="names"
                  label="Nombres"/>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-lastnames">Apellidos</InputLabel>
                <OutlinedInput
                  required
                  id="input-lastnames"
                  type="text"
                  name="lastnames"
                  label="Apellidos"/>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-identification">Identificación (C.C)</InputLabel>
                <OutlinedInput
                  fullWidth
                  required
                  id="input-identification"
                  type="number"
                  name="identification"
                  label="Identificación (C.C)"/>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-rol">Rol asociado</InputLabel>
                <Select
                  required
                  labelId="input-rol"
                  name="rol"
                  label="Rol asociado">
                  <MenuItem value={"administrador"}>Administrador</MenuItem>
                  <MenuItem value={"conductor"}>Conductor</MenuItem>
                  <MenuItem value={"recolector"}>Recolector</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-state">Estado</InputLabel>
                <Select
                  required
                  labelId="input-state"
                  name="state"
                  label="Estado">
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-password">Contraseña</InputLabel>
                <OutlinedInput
                  required
                  id="input-password"
                  type="password"
                  name="password"
                  label="Contraseña"
                  autoComplete="new-password"/>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-phone">Teléfono</InputLabel>
                <OutlinedInput
                  required
                  id="input-phone"
                  type="number"
                  name="phone"
                  label="Teléfono"/>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-email">Correo</InputLabel>
                <OutlinedInput
                  required
                  id="input-email"
                  type="text"
                  name="email"
                  label="Correo"/>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions disableSpacing>
          <Button
            variant="contained"
            type="submit"
            color="secondary"
            style={{
              minWidth: 150,
              marginRight: 8
            }}>Aceptar
          </Button>
          <Button
            variant="outlined"
            onClick={onCloseRegisterDialog}
            color="secondary"
            style={{
              minWidth: 150,
              marginLeft: 8
            }}>Cancelar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
    <Snackbar
      open={snackbar !== null}
      autoHideDuration={snackbar?.time ?? 6000}
      onClose={() => setSnackbar(null)}>
      <Alert onClose={() => setSnackbar(null)} severity={snackbar?.type}>
        {snackbar?.message}
      </Alert>
    </Snackbar>
  </Box>
}

export default CreateUserButton;