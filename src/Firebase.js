import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDYiSaAKSQteRvbF40_ciuAzlI8S0wuM9o",
    authDomain: "evoting-42877.firebaseapp.com",
    projectId: "evoting-42877",
    storageBucket: "evoting-42877.appspot.com",
    messagingSenderId: "729070810820",
    appId: "1:729070810820:web:e1455dbc7d06d9407b7b91"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };



