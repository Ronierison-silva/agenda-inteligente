// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTknQxXhqQPKkdRbPGwlUCzBiQ7QZFYJ0",
  authDomain: "hora-do-cliente.firebaseapp.com",
  projectId: "hora-do-cliente",
  storageBucket: "hora-do-cliente.appspot.com",
  messagingSenderId: "1015480548613",
  appId: "1:1015480548613:web:8d2d28e3af05b1e5a3cb6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');