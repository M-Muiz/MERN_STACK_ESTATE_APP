import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-e6aeb.firebaseapp.com",
  projectId: "mern-estate-e6aeb",
  storageBucket: "mern-estate-e6aeb.appspot.com",
  messagingSenderId: "321690189243",
  appId: "1:321690189243:web:d357bd79b38abe7fce589e"
};


export const app = initializeApp(firebaseConfig);