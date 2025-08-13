// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCz9yTPaMzAhsg98sGBWGf2hfQgyuOAxlg",
  authDomain: "barselapps-sampahku.firebaseapp.com",
  databaseURL: "https://barselapps-sampahku-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "barselapps-sampahku",
  storageBucket: "barselapps-sampahku.firebasestorage.app",
  messagingSenderId: "130494325855",
  appId: "1:130494325855:web:e64fe97e4e8256b416e7ea",
  measurementId: "G-RDSHBFW2Q5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);