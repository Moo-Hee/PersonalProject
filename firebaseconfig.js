// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZShX87fsI5C35TbgrHNVUJ4VKrCswXR0",
  authDomain: "personalproject-28270.firebaseapp.com",
  projectId: "personalproject-28270",
  storageBucket: "personalproject-28270.appspot.com",
  messagingSenderId: "658271667955",
  appId: "1:658271667955:web:dac7fdbc7d5d578d521986",
  measurementId: "G-2JQ60KSDEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firebase = getFirestore(app);

export default firebase