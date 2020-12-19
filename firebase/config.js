import fb from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0KnWOZIv538YqLoHXfkZzqXc_yrpFqxk",
  authDomain: "ninetales-7a73d.firebaseapp.com",
  projectId: "ninetales-7a73d",
  storageBucket: "ninetales-7a73d.appspot.com",
  messagingSenderId: "93630331004",
  appId: "1:93630331004:web:562bc3e600aed132f7f1f9",
  measurementId: "G-WSG7YFB8L4",
};
// Initialize Firebase

let firebase, storage, firestore, timestamp;
if (typeof window !== "undefined" && !fb.apps.length) {
  firebase = fb.initializeApp(firebaseConfig);
  storage = firebase.storage();
  firestore = firebase.firestore();
}

export { firebase, storage, firestore };
