import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMINSDK_JSON)),
  });
}

const firestore = admin.firestore();

export { admin, firestore };
