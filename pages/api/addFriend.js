import { admin, firestore } from "../../firebase/admin";

export default async (req, res) => {
  const { method, cookies, body } = req;

  if (method === "POST") {
    try {
      const token = await admin.auth().verifyIdToken(cookies.token);
      const { name: username } = token;

      const { target } = JSON.parse(body);

      await firestore.collection("pendingRequests").add({
        source: username,
        target,
      });

      res.status(200).end();
    } catch (err) {
      console.log("err", err);
      res.status(401).end();
    }
  } else {
    res.status(405).end();
  }
};
