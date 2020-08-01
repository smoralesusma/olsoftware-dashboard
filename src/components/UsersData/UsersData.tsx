import React, { useState, useEffect, useContext } from "react";
import firebase from "firebase";
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel, 
  OutlinedInput,
  Select,
  MenuItem,
  Button, 
  Snackbar,
  makeStyles,
  useTheme } from "@material-ui/core";
import { Group, GroupAdd } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

import UsersTable from "../UsersData/UsersTable";
import CreateUserButton from "./CreateUserButton";
import { AuthContext } from "../Tools/Auth";
import firebaseInitApp from "../../services/Firebase";

export interface IUserData {
  id?: string;
  names: string;
  lastnames: string;
  identification: number;
  rol: "administrador" | "conductor" | "recolector";
  state: boolean;
  phone: number;
  email: string;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    overflow: "auto"
  },
  titleTable: {
    display: 'flex',
    alignItems: "center",
    flexGrow: 1,
    paddingBottom: theme.spacing(2)
  },
  titleIcon: {
    fontSize: 30,
    paddingRight: theme.spacing(2)
  },
  titleText: {
    [theme.breakpoints.down('sm')]: {
      display: "none"
    },
  }
}))

const UsersData = () => {
  const [users, setUsers] = useState<IUserData[] | undefined>(undefined);
  const [filteredUsers, setFilteredUsers] = useState<IUserData[] | undefined>(undefined);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    type: "success" | "info" | "warning" | "error",
    message: string, time?: number } | null>(null);

  const { currentUser } = useContext(AuthContext);
    
  const theme = useTheme();
  const classes = useStyles(theme);

  useEffect(() => {
    if (currentUser) {
      const usersDB = firebase.firestore(firebaseInitApp).collection("USER");
      usersDB.get().then(async (users) => {
        const usersData: IUserData[] = [];
        let isNewUser = true;
        users.docs.forEach(user => {
          const userData = user.data();
          if (userData.email === currentUser.email) {
            setCanEdit(userData.rol === "administrador");
            isNewUser = false;
          }
          const userInfo: IUserData = {
            id: user.id,
            ...userData as any,
          }
          usersData.push(userInfo);
        });
        if (isNewUser) {
          const newUserData: IUserData = {
            names: "N/A",
            lastnames: "N/A",
            identification: 0,
            rol: "conductor",
            state: false,
            phone: 1234567,
            email: currentUser.email!
          }
          const newUser = await usersDB.add(newUserData);

          newUserData.id = newUser.id;

          usersData.push(newUserData);
          setUsers([...usersData]);
        } else setUsers([...usersData]);
      })
    }
  }, [currentUser]);

  const onFilterUsers  = (event: any) => {
    event.preventDefault();
    const {
      names,
      lastnames,
      identification,
      rol,
      state,
      phone,
      email } = event.target.elements;

    const namesValue: string = names.value.trim();
    const lastnamesValue: string = lastnames.value.trim();
    const identificationValue: string = identification.value.trim();
    const rolValue: string = rol.value.trim();
    const stateValue: string = state.value.trim();
    const phoneValue: string = phone.value.trim();
    const emailValue: string = email.value.trim();
    
    if (users) {
      let newFilter = users;
      if (namesValue.length > 0) newFilter = newFilter.filter((user) => user.names.includes(namesValue));
      if (lastnamesValue.length > 0) newFilter = newFilter.filter((user) => user.lastnames.includes(lastnamesValue));
      if (identificationValue.length > 0) newFilter = newFilter.filter((user) => user.identification.toString().includes(identificationValue));
      if (rolValue.length > 0) newFilter = newFilter.filter((user) => user.rol === rolValue);
      if (stateValue.length > 0) newFilter = newFilter.filter((user) => {
        if (user.state) return '1' === stateValue;
        else return '0' === stateValue;
      });
      if (phoneValue.length > 0) newFilter = newFilter.filter((user) => user.phone.toString().includes(phoneValue));
      if (emailValue.length > 0) newFilter = newFilter.filter((user) => user.email.includes(emailValue));

      if (newFilter.length > 0) setFilteredUsers([...newFilter]);
      else setFilteredUsers(undefined)
    }
  }

  return <Grid container spacing={2}>
    <Grid item xs={12} lg={9}>
      <Paper className={classes.paper}>
        <Box className={classes.titleTable}>
          <Box
            px={2}
            display="flex"
            alignItems="center"
            flexGrow={1}>
            <Group color="primary" className={classes.titleIcon}/>
            <Typography
              className={classes.titleText}
              variant="h6"
              color="primary"
              component="p">Usuarios existentes
            </Typography>
          </Box>
          {canEdit && <CreateUserButton
            setUser={(newUserData) => {
              if (users) {
                setUsers([...users, newUserData]);
                setFilteredUsers(undefined);
              } else setUsers([newUserData]);
              setSnackbar({ type:"success", message: "El usuario ha sido creado" });
            }}/>}
        </Box>
        <UsersTable
          users={users}
          canEdit={canEdit}
          setUsers={setUsers}
          filteredUsers={filteredUsers}/>
      </Paper>
    </Grid>
    <Grid item xs={12} lg={3}>
      <Paper className={classes.paper}>
        <Box
          px={2}
          pb={2}
          display="flex"
          alignItems="center"
          flexGrow={1}>
          <GroupAdd color="primary" className={classes.titleIcon}/>
          <Typography
            className={classes.titleText}
            variant="h6"
            color="primary"
            component="p">Filtrar búsqueda
          </Typography>
        </Box>
        <form onSubmit={onFilterUsers} id="filter-form">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-names">Nombres</InputLabel>
                <OutlinedInput
                  id="input-names"
                  type="text"
                  name="names"
                  label="Nombres"/>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-lastnames">Apellidos</InputLabel>
                <OutlinedInput
                  id="input-lastnames"
                  type="text"
                  name="lastnames"
                  label="Apellidos"/>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-identification">Identificación (C.C)</InputLabel>
                <OutlinedInput
                  fullWidth
                  id="input-identification"
                  type="number"
                  name="identification"
                  label="Identificación (C.C)"/>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-rol">Rol asociado</InputLabel>
                <Select
                  labelId="input-rol"
                  name="rol"
                  label="Rol asociado">
                  <MenuItem value={"administrador"}>Administrador</MenuItem>
                  <MenuItem value={"conductor"}>Conductor</MenuItem>
                  <MenuItem value={"recolector"}>Recolector</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-state">Estado</InputLabel>
                <Select
                  labelId="input-state"
                  name="state"
                  label="Estado">
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-phone">Teléfono</InputLabel>
                <OutlinedInput
                  id="input-phone"
                  type="number"
                  name="phone"
                  label="Teléfono"/>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="input-email">Correo</InputLabel>
                <OutlinedInput
                  id="input-email"
                  type="text"
                  name="email"
                  label="Correo"/>
              </FormControl>
            </Grid>
            <Box px={1} width="100%">
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    type="submit"
                    color="secondary"
                    fullWidth>Filtrar
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      (document
                        .getElementById("filter-form") as HTMLFormElement)
                        .reset();
                      setFilteredUsers(undefined);
                    }}
                    color="secondary"
                    fullWidth>Limpiar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </form>
      </Paper>
    </Grid>
    <Snackbar
      open={snackbar !== null}
      autoHideDuration={snackbar?.time ?? 6000}
      onClose={() => setSnackbar(null)}>
      <Alert onClose={() => setSnackbar(null)} severity={snackbar?.type}>
        {snackbar?.message}
      </Alert>
    </Snackbar>
  </Grid>
}

export default UsersData;