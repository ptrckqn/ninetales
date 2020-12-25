import { admin, firestore } from "../../firebase/admin";

export default async (req, res) => {
  const { method, body } = req;

  if (method === "POST") {
    try {
      const { name, email, username, password } = JSON.parse(body);

      const docRef = firestore.collection("users").doc(username.toLowerCase());
      let doc = await docRef.get();
      if (!doc.exists) {
        const user = await admin.auth().createUser({
          email,
          emailVerified: true,
          password,
          displayName: username,
        });

        doc = await docRef.set({
          uid: user.uid,
          name,
          email,
          username,
          friends: [],
        });
      } else {
        res.status(200).json({ error: "Username is already in use." });
      }

      res.status(200).json({ user: doc });
    } catch (err) {
      res.status(200).json({ error: err.errorInfo.message });
    }
  } else {
    res.status(405).end();
  }
};
