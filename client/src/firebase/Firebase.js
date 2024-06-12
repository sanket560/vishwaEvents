import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBU-fxdag0DRbvbGlQO4aHepRd04YYO1uc",
  authDomain: "vishwaevent-1e576.firebaseapp.com",
  projectId: "vishwaevent-1e576",
  storageBucket: "vishwaevent-1e576.appspot.com",
  messagingSenderId: "680938769524",
  appId: "1:680938769524:web:2f63a475ae8ec6ac835521"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);