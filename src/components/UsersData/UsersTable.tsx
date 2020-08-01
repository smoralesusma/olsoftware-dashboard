import React, { forwardRef, useContext, useState } from "react";
import firebase from "firebase";
import MaterialTable, { Icons } from "material-table";
import { Snackbar, Box } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import firebaseInitApp, { onDeleteUser, onModifyUser } from "../../services/Firebase";
import { IUserData } from "./UsersData";
import { AuthContext } from "../Tools/Auth";

const MaterialTableIcons: Icons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} color="primary" ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export interface IUsersTable {
  users: IUserData[] | undefined;
  filteredUsers: IUserData[] | undefined;
  canEdit: boolean;
  setUsers: (userData: IUserData[]) => void;
}

const UsersTable = ({ users, filteredUsers, canEdit, setUsers }: IUsersTable) => {
  const [snackbar, setSnackbar] = useState<{
    type: "success" | "info" | "warning" | "error",
    message: string, time?: number } | null>(null);

  const { currentUser } = useContext(AuthContext);

  if (users) return <Box>
    <MaterialTable
      style={{
        tableLayout: "fixed",
        whiteSpace: "nowrap",
        boxShadow: "none",
        MozBoxShadow: "none",
        WebkitBoxShadow: "none",
      }}
      options={{
        filtering: true,
        actionsColumnIndex: 7,
        exportButton: canEdit,
        exportFileName: "tabla_de_usuarios"
      }}
      icons={MaterialTableIcons}
      columns={[
        { title: "Nombres", field: "names" },
        { title: "Apellidos", field: "lastnames" },
        { title: "Identificación (C.C)", field: "identification" },
        { title: "Rol asociado", field: "rol", lookup: {
          "administrador": "Administrador",
          "conductor": "Conductor",
          "recolector":"Recolector" } },
        { title: "Estado", field: "state", lookup: { true: "Activo", false: "Inactivo" } },
        { title: "Teléfono", field: "phone" },
        { title: "Correo", field: "email" }
      ]}
      data={filteredUsers ?? users}
      title=""
      localization={{
        body: {
          editRow: {
            deleteText: '¿Desea eliminar este usuario?',
            cancelTooltip: "Cancelar",
            saveTooltip: 'Guardar',
          },
          editTooltip: "Editar usuario",
          deleteTooltip: "Eliminar usuario"
        },
        header: {
          actions: "Acciones",
        }
      }}
      editable={canEdit ? {
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {            
              if (isNaN(Number(newData.phone))) {
                setSnackbar({ type:"error", message: "Teléfono invalido" });
                reject();
                return
              }
              if (isNaN(Number(newData.identification))) {
                setSnackbar({ type:"error", message: "Identificación invalida" });
                reject();
                return
              }
  
              const dataUpdate = [...users];
              const index = dataUpdate.findIndex(
                (data) => data.email === oldData!.email);
              
              const email = oldData!.email;
              const newEmail = newData.email;
              dataUpdate[index] = newData;
  
              if (email !== newEmail) {
                // eslint-disable-next-line
                const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const validEmail = mailRegex.test(newEmail.toLowerCase());

                if (validEmail) {
                  onModifyUser(email, newEmail).then(async (response) => {
                    console.log(response);
                    const userCollection = firebase.firestore(firebaseInitApp)
                      .collection("USER");
                    await userCollection.doc(newData.id).set({
                      names: newData.names,
                      lastnames: newData.lastnames,
                      identification: Number(newData.identification),
                      rol: newData.rol,
                      state: newData.state,
                      phone: Number(newData.phone),
                      email: newData.email
                    });
    
                    setUsers([...dataUpdate]);
                    resolve();
                  }).catch(() => {
                    setSnackbar({ type:"error", message: "Algo ha salido mál editando el usuario" });
                    reject();
                    return
                  });
                } else {
                  setSnackbar({ type:"error", message: "No es un correo válido" });
                  reject();
                  return
                }
              } else {
                const userCollection = firebase.firestore(firebaseInitApp)
                  .collection("USER");
                userCollection.doc(newData.id).set({
                  names: newData.names,
                  lastnames: newData.lastnames,
                  identification: Number(newData.identification),
                  rol: newData.rol,
                  state: newData.state,
                  phone: Number(newData.phone),
                  email: newData.email
                }).then(() => {
                  setUsers([...dataUpdate]);
                  resolve()
                }).catch(() => {
                  setSnackbar({ type:"error", message: "Algo ha salido mál editando el usuario" });
                  reject();
                  return
                });
              }
            }, 1000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...users];
              const index = dataDelete.findIndex(
                (data) => data.email === oldData.email);
              dataDelete.splice(index, 1);
  
              const email = oldData.email as string;
  
              if (currentUser?.email === email) {
                setSnackbar({ type:"error", message: "No puede eliminar el usuario actual" });
                reject();
              } else {
                onDeleteUser(email).then(async (response) => {
                  console.log(response);
                  if (currentUser?.email === email) 
                    await firebaseInitApp.auth().signOut();
                  const userCollection = firebase.firestore(firebaseInitApp)
                  .collection("USER");
                  await userCollection.doc(oldData.id).delete();
                  setUsers([...dataDelete]);
  
                  resolve();
                }).catch(() => {
                  setSnackbar({ type:"error", message: "Algo ha salido mál eliminadno el usuario" });
                  reject();
                  return
                });
              }
            }, 1000)
          }),
      } : undefined}/>
    <Snackbar
      open={snackbar !== null}
      autoHideDuration={snackbar?.time ?? 6000}
      onClose={() => setSnackbar(null)}>
      <Alert onClose={() => setSnackbar(null)} severity={snackbar?.type}>
        {snackbar?.message}
      </Alert>
    </Snackbar>
  </Box>
  else return null;
}

export default UsersTable;