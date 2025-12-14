import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Configuration firebase: un projet sur le quel nous avons déjà travaillé en L2
const firebaseConfig = {
  apiKey: "AIzaSyAtMTnFUz0ZvnAvyfxa9yzqWr9dB59euqE",
  authDomain: "recyclingfordummies-53454.firebaseapp.com",
  projectId: "recyclingfordummies-53454",
  storageBucket: "recyclingfordummies-53454.appspot.com",
  messagingSenderId: "240414149383",
  appId: "1:240414149383:web:87627afcfc461ae9b253a2",
  measurementId: "G-R3900MCH2E",
};
// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
// Base de données Firestore
export const db = getFirestore(app);
