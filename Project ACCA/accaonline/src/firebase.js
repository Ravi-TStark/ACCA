  import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAoQEKRjYMJGxwEdnnu7VgyqD2evDWXIe8",
    authDomain: "accaweb07.firebaseapp.com",
    databaseURL: "https://accaweb07.firebaseio.com",
    projectId: "accaweb07",
    storageBucket: "accaweb07.appspot.com",
    messagingSenderId: "136775161332",
    appId: "1:136775161332:web:363f3fbc23b491512395a1",
    measurementId: "G-DJ6CDH90KN"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  const provider = firebase.provider;

  export { db, auth, storage, provider };


