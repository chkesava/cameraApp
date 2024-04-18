
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD7lqGSbgDAIcJoTU9AAJ8-FY4YOPwRCX8",
  authDomain: "imageuploadapi-70132.firebaseapp.com",
  projectId: "imageuploadapi-70132",
  storageBucket: "imageuploadapi-70132.appspot.com",
  messagingSenderId: "1010891779417",
  appId: "1:1010891779417:web:a5b9f964f1b9ee0847f048"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDb=getStorage(app)