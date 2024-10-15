import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCTknQxXhqQPKkdRbPGwlUCzBiQ7QZFYJ0",
  authDomain: "hora-do-cliente.firebaseapp.com",
  projectId: "hora-do-cliente",
  storageBucket: "hora-do-cliente.appspot.com",
  messagingSenderId: "1015480548613",
  appId: "1:1015480548613:web:8d2d28e3af05b1e5a3cb6c"
};

const firebase = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase