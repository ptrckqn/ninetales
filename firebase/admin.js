import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: "ninetales-7a73d.appspot.com/",
  });
}

const firestore = admin.firestore();
const storage = admin.storage();

export { admin, firestore, storage };
