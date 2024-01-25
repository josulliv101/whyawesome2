import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_oY9QK7-zheXCNQdcU_-LQ37xRiGD-sE",
  authDomain: "fir-abc-a965d.firebaseapp.com",
  projectId: "fir-abc-a965d",
  storageBucket: "fir-abc-a965d.appspot.com",
  messagingSenderId: "360517790730",
  appId: "1:360517790730:web:0488ed0f086ee54e26c3f3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
