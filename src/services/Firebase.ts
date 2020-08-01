import firebase from "firebase/app";
import "firebase/auth";

const credentials = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_SORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}

const firebaseInitApp = firebase.initializeApp(credentials);
export default firebaseInitApp;

export const onCreateUser = (email: string, password: string) =>
  firebaseInitApp.functions().httpsCallable('addUser')({ email, password });

export const onDeleteUser = (email: string) =>
  firebaseInitApp.functions().httpsCallable('removeUser')({ email });

export const onModifyUser = (email: string, newEmail:string) => 
  firebaseInitApp.functions().httpsCallable('modifyUser')({ email, newEmail });