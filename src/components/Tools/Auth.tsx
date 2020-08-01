import React, { useEffect, useState, createContext, ReactElement } from "react";
import firebaseAppInit from "../../services/Firebase";
import Loader from "./Loader";

export const AuthContext = createContext<{ currentUser: firebase.User | null }>({ currentUser: null });

export interface IAuthProvider {
  children: ReactElement;
}

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    firebaseAppInit.auth().onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    });
  }, []);

  if(pending){
    return <Loader message="Cargando..."/>
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}</AuthContext.Provider>
  );
}

export default AuthProvider;