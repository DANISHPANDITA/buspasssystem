import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAbydlqN30o1kW0UvXf7AnuhH2nWK-g-F4",
  authDomain: "busapp-aabdc.firebaseapp.com",
  projectId: "busapp-aabdc",
  storageBucket: "busapp-aabdc.appspot.com",
  messagingSenderId: "644239652855",
  appId: "1:644239652855:web:48e9a49eebfe77b4e7a0f2",
  measurementId: "G-V79Z0K0S9P",
});

const db = firebaseApp.firestore();
const storage = firebaseApp.storage();
const auth = firebaseApp.auth();
const googleAuth = new firebase.auth.GoogleAuthProvider();

export { db, storage, auth, googleAuth };
