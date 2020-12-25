import { admin, firestore } from "../../firebase/admin";

export default async (req, res) => {
  const { method, cookies, body } = req;

  if (method === "POST") {
    try {
      const token = await admin.auth().verifyIdToken(cookies.token);
      const { name: username } = token;

      const { id, accept } = JSON.parse(body);

      const requestRef = firestore.collection("pendingRequests").doc(id);
      const source = await new Promise((resolve, reject) => {
        try {
          requestRef.get().then((doc) => {
            const { source } = doc.data();
            resolve(source);
          });
        } catch (err) {
          reject(err);
        }
      });

      if (accept) {
        const sourceRef = firestore.collection("users").doc(source);
        sourceRef.update({
          friends: admin.firestore.FieldValue.arrayUnion(username),
        });

        const targetRef = firestore.collection("users").doc(username);
        targetRef.update({
          friends: admin.firestore.FieldValue.arrayUnion(source),
        });
      }

      requestRef.delete();

      //   await firestore.collection("pendingRequests").add({
      //     source: username,
      //     target,
      //   });

      res.status(200).end();
    } catch (err) {
      console.log("err", err);
      res.status(401).end();
    }
  } else {
    res.status(405).end();
  }
};
